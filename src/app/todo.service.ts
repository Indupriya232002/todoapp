import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './app.component';
@Injectable({
  providedIn: 'root'
})
export class TodoService {
private apiUrl = 'https://localhost:7202/api/Todo';

  constructor(private http: HttpClient) { }

getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
}

addTodo(todo: Todo): Observable<Todo> {
    // Assuming your API expects an object with a 'taskName' and 'taskDate' property
    const todoToAdd = { taskName: todo.taskName, taskDate: todo.taskDate };
    return this.http.post<Todo>(this.apiUrl, todoToAdd);
}

updateTodo(id: number, todo: Todo): Observable<any> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
}

deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}
