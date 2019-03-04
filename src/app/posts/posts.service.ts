import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { $ } from "protractor";
import { environment } from "src/environments/environment";
import { strictEqual } from "assert";
import { map } from "rxjs/operators";
import { post } from "selenium-webdriver/http";
@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private readonly API = `${environment.API}/api/posts`;

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.API)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
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

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId: string }>(this.API, post)
      .subscribe(responseData => {
        const id = responseData.postId;
        console.log(responseData);
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
