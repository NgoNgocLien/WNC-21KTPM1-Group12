import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';
import { ExternalTransactionResponse } from '../auth/types/ExternalTransactionResponse';
import { CreateTransactionDto } from '../transactions/dto/createTransaction.dto';
import { FEE_AMOUNT } from 'src/common/utils/config';

  @Injectable()
  export class BanksService {
    constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => AuthService))
      private readonly authService: AuthService
    ) {}
  
    async getBankByInternalCode(internal_code: string) {
        const bank = await this.prisma.banks.findMany({
          where: {
            internal_code,
          },
        });
            
        return bank ? bank[0]: null
    }

    async getBankById(id: number) {
      const bank = await this.prisma.banks.findUnique({
        where: {
          id,
        },
      });
          
      return bank
    }

    async generateBodyRSA(
      encryptedPayload: string, secret_key: string, isSignature: boolean,
      private_key?: string,
    ){
      const header = {
        hashMethod: 'sha256',
        timestamp: Date.now()
      }
      const integrity = this.authService.hashPayload(JSON.stringify(header) + encryptedPayload, secret_key)

      if (isSignature){
        const signature = await this.authService.createSignature(
          JSON.stringify(header) + encryptedPayload, 
          private_key, 
          "RSA")
        return {
          header,
          encryptedPayload,
          integrity,
          signature
        }
      }

      return {
        header,
        encryptedPayload,
        integrity,
      }
    }

    async generateBodyPGP(
      encryptedPayload: string, secret_key: string, isSignature: boolean,
      private_key?: string,
    ){
      const integrity = this.authService.hashPayload(encryptedPayload, secret_key)

      if (isSignature){
        const signature = await this.authService.createSignature(
          encryptedPayload, 
          private_key, 
          "PGP")
        // console.log(signature)
        return {
          encryptMethod: "PGP",
          encryptedPayload,
          integrity,
          hashedPayload: integrity,
          signature
        }
      }

      return {
        encryptMethod: "PGP",
        encryptedPayload,
        hashedPayload: integrity,
        integrity
      }
    }
    // NoMeo -> 
    async makeTransaction(data: CreateTransactionDto, external_bank: any, url: string){
      try {
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const private_key = (external_bank.rsa_public_key) ? process.env.RSA_PRIVATE_KEY : process.env.PGP_PRIVATE_KEY
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key
              

        let body = null, encryptedPayload = null, transformedTransasction = null;
        switch (encryptMethod){
          case "RSA":
            transformedTransasction = {
              fromBankCode: external_bank.external_code,
              fromAccountNumber: data.sender_account_number,
              toBankAccountNumber: data.recipient_account_number,
              amount: Number(data.transaction_amount),
              message: data.transaction_message,
              feePayer: data.fee_payment_method,
              feeAmount: FEE_AMOUNT,
            }
            encryptedPayload = await this.authService.encryptData(JSON.stringify(transformedTransasction), public_key, "RSA")
            body = await this.generateBodyRSA(encryptedPayload, external_bank.secret_key, true, private_key)
            break;
          case "PGP":
            transformedTransasction = {
              bank_code: external_bank.external_code,
              sender_account_number: data.sender_account_number,
              recipient_account_number: data.recipient_account_number,
              transaction_amount: Number(data.transaction_amount),
              transaction_message: data.transaction_message,
              fee_payment_method: data.fee_payment_method,
              fee_amount: FEE_AMOUNT,
              timestamp: Date.now()
            }
            encryptedPayload = await this.authService.encryptData(JSON.stringify(transformedTransasction), public_key, "PGP")
            body = await this.generateBodyPGP(encryptedPayload, external_bank.secret_key, true, private_key)
            break;
          default:
        }
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dataResponse = await response.json();
        let decryptedPayload = null;

        encryptedPayload = (dataResponse.data) ? dataResponse.data.encryptedPayload : dataResponse.encryptedPayload
        // console.log(encryptedPayload)
        decryptedPayload = await this.authService.decryptData(encryptedPayload, private_key, encryptMethod);


        if (encryptMethod == "RSA" && decryptedPayload.statusCode === 200){
          return {sender_signature: body.signature, recipient_signature: dataResponse.signature};
        } if (encryptMethod == "PGP") {
          return {sender_signature: body.signature, recipient_signature: dataResponse.signature};
        } else{
          throw new Error("Error in creating transaction in external server")
        }
      } catch (error) {
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    // NoMe0 ->
    async getExternalFullname(account_number: string, external_bank: any, url: string){
      try {
        const encryptMethod = (external_bank.rsa_public_key) ? "RSA" : "PGP"
        const public_key = external_bank.rsa_public_key || external_bank.pgp_public_key
        const private_key = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY : process.env.RSA_PRIVATE_KEY
      
        let body = null, payload = null, encryptedPayload = null;
        switch (encryptMethod){
          case "RSA":
            payload = {
              fromBankCode: external_bank.external_code, 
              accountNumber: account_number
            }
            encryptedPayload = await this.authService.encryptData(JSON.stringify(payload), public_key, encryptMethod )
            body = await this.generateBodyRSA(encryptedPayload, external_bank.secret_key, false, private_key)
            break;
          case "PGP":
            payload = {
              bank_code: external_bank.external_code, 
              account_number,
              timestamp: Date.now() 
            }
            encryptedPayload = await this.authService.encryptData(JSON.stringify(payload), public_key, encryptMethod )
            body = await this.generateBodyPGP(encryptedPayload, external_bank.secret_key, false, private_key)
            break;
          default:
        }
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Error:', error);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dataResponse = await response.json();
        let decryptedPayload = null;
        encryptedPayload = (dataResponse.data) ? dataResponse.data.encryptedPayload : dataResponse.encryptedPayload
        // console.log(encryptedPayload)
        decryptedPayload = await this.authService.decryptData(encryptedPayload, private_key, encryptMethod);
        

        if (encryptMethod == "RSA" && decryptedPayload.statusCode === 200){
          return decryptedPayload.data.customer.full_name;
        } if (encryptMethod == "PGP") {
          return decryptedPayload.fullname;
        } else{
          throw new Error("Error in creating transaction in external server")
        }

      } catch (error) {
        console.log(error)
        console.error('Error calling external API:', error.message);
        throw error; // Nếu cần xử lý lỗi ở nơi khác
      }
    }

    // -> NoMeo
    async generateExternalResponseData(data: string, external_bank: any, encryptMethod: string): Promise<ExternalTransactionResponse>{
      const private_key = (encryptMethod == "PGP") ? process.env.PGP_PRIVATE_KEY : process.env.RSA_PRIVATE_KEY
      const public_key = (encryptMethod == "PGP") ? external_bank.pgp_public_key : external_bank.rsa_public_key
      const encryptedPayload = await this.authService.encryptData(data, public_key, encryptMethod);
      const signature = await this.authService.createSignature(encryptedPayload, private_key, encryptMethod)
      return {
        encryptedPayload,
        signature
      }
    }
  }
  