import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User("","","","");
  users = [];
  puppies = [];
  login = true;
  exists = false;
  credentials = true;
  userID;
  random;
  puppy;

  constructor(private _route: ActivatedRoute, private service: TaskService, private router: Router) { }

  onSubmit(data){
    console.log(this.users)
    for (var email of this.users){
      if(email.email == data.value.email){
        this.exists = true;
        this.router.navigate(['/']);
      }
    }

    if(this.exists == false){
      console.log("user info:", data.value)
      this.user.firstname = data.value.firstname;
      this.user.lastname = data.value.lastname;
      this.user.email = data.value.email;
      this.user.password = data.value.password;
      this.service.createUser(this.user,

        (res) => {
          this.service.userID = res.json()['user']._id;
          this.router.navigate(['browse']);
        }

      );
    }

  }

  checkPassword(password, email){
    this.service.checkPassword(password, email,
    (data) => {
      console.log(data.json()['user'])
      if(data.json()['user'].length == 0){
        console.log("INCORRECT CREDENTIALS");
        this.credentials = false;
        this.router.navigate(['']);
        this.ngOnInit();
      }
      else{
        this.service.userID = data.json()['user'][0]._id;
        this.router.navigate(['browse']);
      }
    });
  }

  ngOnInit() {
    this.service.fetchPosts(
      (res) => {
        this.puppies = res.json()['puppies'];
        this.random = Math.floor(Math.random()*this.puppies.length);
        this.puppy = this.puppies[this.random];
      }
    )
  }

  onClick(){
    this.login = false;
    console.log("random number:",this.random);
  }

  onSign(){
    this.login = true;
  }

}
