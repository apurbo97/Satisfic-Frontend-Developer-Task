import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit {
  submitClick = false;
  form : FormGroup = new FormGroup({});
  ratings = [];
  statuss=[];
  user:any;
  isAllowedToEdit:boolean = false;
  isEdit:boolean = false;
  constructor( public dialogRef: MatDialogRef<LeadDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService:ApiServiceService,
    private _snackBar: MatSnackBar) {
      this.form = this.data.form;
      this.ratings = this.data.ratings;
      this.statuss = this.data.statuss;
    }

  ngOnInit(): void {
    this.form.disabled;
    this.user = localStorage.getItem('user_details');
    if(this.user){
      this.apiService.getLeadById(this.data.id).subscribe(res=>{
        this.form.patchValue(res);
        if(res.assignee === JSON.parse(this.user)?.username){
          this.isAllowedToEdit = true;
          
        }
      },err=>{
        this.openSnackBar(err, 'Close');
        this.onNoClick();
      });
    }
    else{
      this.onNoClick()
    }

    if(this.data.type === 'view')
      this.isEdit = true;
    
    this.toggleForm()
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onUpdateClick(){
    if(this.form.valid){
      this.submitClick = true;
      console.log(this.form.value);
      this.apiService.updateLead(this.data.id,this.form.value).subscribe(res=>{
        if(res){
          console.log(res);
          this.dialogRef.close({status:'Updated Successfully'});
        }
      },
      err =>{
        this.submitClick = false;
        this.openSnackBar(err, 'Close');
      }
      )
    }
    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  toggleForm(){
    if(this.isEdit){
      this.isEdit = false;
      this.form.disable();
    }
    else{
      this.isEdit = true;
      this.form.enable();
    }
  }



}
