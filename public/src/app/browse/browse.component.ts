import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Puppy } from '../puppy';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  puppies = [];
  users = [];
  userID;
  deleted =[];
  modal = false;
  modalID;
  count = 0;
  searchResults = false;

  constructor(private _route: ActivatedRoute, private service: TaskService, private router: Router) { }

  ngOnInit() {
    this.fetchPuppies();
    this.fetchUsers();
    if(this.service.userID === undefined){
      console.log("new user");
    }
    else {
      this.userID = this.service.userID;
      console.log("existing user id:",this.userID);
      // console.log("created user id:", this.puppies.length);
    }
  }

  delete(id){
    this.service.delete(id);
    this.router.navigate(['browse']);
    this.fetchPuppies();
  }

  fetchPuppies(){
    this.service.fetchPosts(
      (res) => {
        // this.puppies = res.json()['puppies'];
        var arr = res.json()['puppies'];
        for(var i = arr.length-1; i >= 0; i --){
          this.puppies.push(arr[i]);
        }
      }
    )
  }

  fetchUsers(){
    this.service.fetchUsers(
      (res) => {
        this.users = res.json()['users'];
      }
    )
  }

  search(data){
    this.count = 0;
    for(var product in this.puppies){
      if (this.puppies[product].name == data){
        this.count = this.count + 1;
      }
    }
    if(this.count > 0){
      this.searchResults = true;
    }
    else {
      this.searchResults = false;
    }
  }

  contact(data){
    this.modal = true;
    this.modalID = data;
  }

  close(){
    this.modal = false;
  }

  logOut(){
    this.service.logOut();
    this.router.navigate(['/']);
  }

}
