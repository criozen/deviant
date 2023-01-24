import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { AdminService } from './service/admin.service';
import { CommonContractService } from '../shared/common-contract.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
 
  public files: File[] = [];
  public isTabActive: number = 0;
  public excelData: any = [];
  public bulkUploadErrorLine: any = [];
  public isError : boolean = false;
  public isBulkDataValid = true;
  public processing = false;
  public bulkData: any = [];
  public account: any;
  constructor(
    private adminService: AdminService,
    private commonContractService: CommonContractService
  ) {}

  async ngOnInit() {
    this.commonContractService.accountObservable.subscribe(async (res: any) => {
      this.account = await res;
      
    });
    
    
  }
  async onSelect(event: any) {
    this.processing = true;
    this.isError  = false;
    this.isBulkDataValid = true;
    console.log(event);
    this.bulkData = [];
    this.bulkUploadErrorLine = [];
    this.files.splice(0, 1, ...event.addedFiles);
    let file = this.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = async (e: any) => {
      let bulkUpload = XLSX.read(fileReader.result, { type: 'binary' });
      let xlsName = bulkUpload.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(bulkUpload.Sheets[xlsName[0]], {
        blankrows: true,
        defval: null,
      });
      for (let i = 0; i < this.excelData.length; i++) {
        let isTrue = await this.adminService.isValidAddress(
          this.excelData[i].wallet_address
        );
        if (isTrue) {
          this.bulkData.push(this.excelData[i].wallet_address);
        }
        if (
          this.excelData[i].wallet_address != null ||
          this.excelData[i].amount != null
        ) {
          if (!isTrue && this.excelData[i].wallet_address != '') {
           
            this.bulkUploadErrorLine.push(i + 2);
            this.isError = true;
            console.log('false', this.bulkUploadErrorLine);

            if (this.isBulkDataValid) {
              this.isBulkDataValid = false;
            }
          }
        }
      }
      if(!this.isBulkDataValid){
        let message:any = 'Error Lines : '+this.bulkUploadErrorLine 
        this.sendBotText(message)
      }
      console.log(this.isBulkDataValid);

      console.log('new dataaaaa', this.bulkData);
    };
    this.processing = false;
  }


  public async sendBotText(message:any) {
    await this.commonContractService.sendBotText(message);
    this.bulkUploadErrorLine = '';
  }

  public async airdrop(){
    this.processing=true
    var abi: any = await this.adminService.createAbi(
      this.bulkData
    );

    const airdrop: any = await this.adminService
    .airdrop(
      this.account.walletAddress,
      abi,
      
    )
    .catch((error: any) => {
      // this.processing = false;
      // if (error.data?.code === 4001) this.toastr.error('User Rejected');
      // else this.toastr.error(error.data.message);
      console.log(error.data.message);
    });
    if(airdrop){
      alert('Airdrop DONE!!!!')
      window.location.reload()
    }
  }
  


  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    console.log(this.files);
  }
  setActiveTab(index: number) {
    this.isTabActive = index;
    this.bulkData=[]
    this.files=[]
  }
}
