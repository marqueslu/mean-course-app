import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { $ } from "protractor";
import { environment } from "src/environments/environment";
import { strictEqual } from "assert";
import { map } from "rxjs/operators";
// import { post } from "selenium-webdriver/http";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private readonly API = `${environment.API}/api/posts`;

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.API)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(`${this.API}/${id}`);
  }
  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };

    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string, post: Post }>(this.API, postData)
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        const id = responseData.post.id;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    else {
      postData = { 
        id: id, 
        title: title, 
        content: content, 
        imagePath: image 
      };
    }

    this.http.put(`${this.API}/${id}`, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`${this.API}/${postId}`)
      .subscribe(() => {
        const updateDPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updateDPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
