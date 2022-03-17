import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.scss']
})
export class AddLeadComponent implements OnInit {
  submitClick = false;
  form : FormGroup = new FormGroup({});
  ratings = [];
  statuss=[];

  constructor( public dialogRef: MatDialogRef<AddLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService:ApiServiceService,
    private _snackBar: MatSnackBar) {
      this.form = this.data.form;
      this.ratings = this.data.ratings;
      this.statuss = this.data.statuss;
     }

  ngOnInit(): void {
    const user = localStorage.getItem('user_details');
    if(user){
      this.form.controls.assignee.setValue(JSON.parse(user)?.username);
    }
    else{
      this.onNoClick()
    }
  }



  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onAddClick(){
    if(this.form.valid){
      this.submitClick = true;
      console.log(this.form.value);
      this.apiService.addLead(this.form.value).subscribe(res=>{
        if(res){
          this.form.reset();
          this.dialogRef.close({status:'Added Successfully'});
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
}
