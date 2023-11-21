import { Time } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TodoService } from './todo.service';
import Swal from 'sweetalert2';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'todo-app';
  todos: Todo[] = [];
  newTodo: Todo = { taskName: '', taskDate: new Date(), id: 1 };
  editingTodo: Todo | null = null;
  successMessage: string | null = null;
  searchTerm: string = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  get filteredTodos(): Todo[] {
    if (!this.searchTerm) {
      return this.todos;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    return this.todos.filter(todo =>
      todo.taskName.toLowerCase().includes(searchTermLower)
    );
  }




  loadTodos(): void {
    this.todoService.getTodos().subscribe(
      (data) => {
        this.todos = data;
      },
      (error) => {
        console.error('Error fetching todos', error);
      }
    );
  }


  addTodo(): void {
    // Validate taskName and taskDate before making the API call
    if (!this.newTodo.taskName) {
      Swal.fire({
        icon: 'error',
        title: 'Task Name Required',
        text: 'Please enter a task Name.',
      });
      return;
    }
  
    if (this.todos.some(todo => todo.taskName === this.newTodo.taskName)) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Task Name',
        text: 'A task with this name already exists. Please enter a unique task Name.',
      });
      return;
    }

    if (!this.newTodo.taskDate) {
      Swal.fire({
        icon: 'error',
        title: 'Task Date Required',
        text: 'Please enter a task Date.',
      });
      return;
    }
    // Add the todo through the service
    this.todoService.addTodo(this.newTodo).subscribe(
      (data) => {
        // Data successfully added
        this.todos.push(data);
  
        // Reset the form
        this.newTodo = { taskName: '', taskDate: new Date(), id: 1 };
      },
      (error) => {
        // Handle error
        console.error('Error adding todo', error);
        Swal.fire({
          icon: 'error',
          title: 'Error Adding Todo',
          text: 'There was an error adding the todo. Please try again.',
        });
      }
    );
  }
  
  closeModal(): void {
    this.editingTodo = null; // Assuming you want to close the modal by setting editingTodo to null
  }
  

  editTodo(todo: Todo): void {
    this.editingTodo = todo;
  }

  openEditPopup(todo: Todo): void {
    this.editingTodo = { ...todo };
  }

  closePopup(): void {
    this.editingTodo = null;
    this.successMessage = null; // Clear the success message
  }

  updateTodo(): void {
    // Check if editingTodo is not null and has an ID
    if (this.editingTodo && this.editingTodo.id !== undefined) {
      // Update the todo through the service
      this.todoService.updateTodo(this.editingTodo.id, this.editingTodo).subscribe(
        (x) => {
          console.log(x);
          // Reload todos if the update is successful
          if (x) {
            this.loadTodos();
          }
          // Reset the editingTodo
          this.editingTodo = null; 
          // Show success popup
          Swal.fire({
            icon: 'success',
            title: 'Successfully Updated',
            text: 'The todo has been updated successfully.',
          });
        },
        (error) => {
          // Handle error
          console.error('Error updating todo', error);
          // Show error message if needed
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'There was an error updating the todo. Please try again.',
          });
        }
      );
    } else {
      console.error('Invalid editingTodo object for updateTodo');
    }
  }
  


  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(
      () => {
        this.todos = this.todos.filter(t => t.id !== id);
      },
      (error) => {
        console.error('Error deleting todo', error);
      }
    );
  }

}


export interface Todo {
  id: number;
  taskName: string;
  taskDate: Date;
}
