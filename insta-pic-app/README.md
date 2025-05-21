# 📘 ¿Qué es un Observable en Angular?

En Angular, un **Observable** es una herramienta poderosa para manejar datos **asíncronos** y **eventos**. Proviene de la librería **RxJS**, que ya viene incluida en Angular.

---

## 🔄 ¿Qué es un Observable?

Un **Observable** es como una **fuente de datos que emite valores en el tiempo**. Puede emitir uno o varios valores, o incluso ninguno, y otras partes del código pueden **suscribirse** para reaccionar a esos valores cuando ocurren.

---

## ⚙️ Enfoque Normal (Imperativo)

- Usa `async/await` o `toPromise()` para esperar una respuesta.
- Sencillo de implementar en lógica secuencial.

```ts
async login(username: string, password: string): Promise<boolean> {
  try {
    const response = await this.http
      .post('/login', { username, password })
      .toPromise();
    return true;
  } catch (err) {
    return false;
  }
}
```

---

## ⚡ Enfoque Reactivo (Observable)

- Usa operadores de **RxJS** como `map`, `switchMap`, `tap`, etc.
- Ideal para flujos complejos, eventos múltiples y cancelables.

```ts
login(username: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>('/login', { username, password }).pipe(
    tap({
      next: (response) => console.log(response),
      error: (error) => console.error('Error', error)
    })
  );
}
```

---

## ✅ Ventajas

| Enfoque        | Ventajas                                      |
|----------------|-----------------------------------------------|
| **Imperativo** | Simple, familiar, ideal para flujos únicos    |
| **Reactivo**   | Escalable, cancelable, se adapta a flujos complejos |

---

## ❌ Desventajas

| Enfoque        | Desventajas                                     |
|----------------|--------------------------------------------------|
| **Imperativo** | No cancelable, limitado para flujos múltiples    |
| **Reactivo**   | Mayor curva de aprendizaje, más complejo de leer |

---

## 📌 ¿Cuándo usar cada uno?

- **Imperativo:** Operaciones simples y secuenciales, prototipos.
- **Reactivo:** Validaciones de formularios, múltiples llamadas HTTP, apps en tiempo real.

---

## 🧠 ¿Para qué se usan en Angular?

Los Observables se usan frecuentemente en Angular para:

- Llamadas HTTP (`HttpClient`)
- Manejo de eventos del usuario (clics, inputs, etc.)
- Formularios reactivos
- Comunicación entre componentes o servicios

---

## 📦 Ejemplo básico

```ts
import { Observable } from 'rxjs';

const obs$ = new Observable<string>((observer) => {
  observer.next('Hola');
  observer.next('¿Cómo estás?');
  observer.complete();
});

obs$.subscribe({
  next: (valor) => console.log('Valor:', valor),
  complete: () => console.log('¡Completado!')
});
```

```txt
// Salida esperada en consola:
Valor: Hola
Valor: ¿Cómo estás?
¡Completado!
```

---

## 📡 Ejemplo real: Llamada HTTP en Angular

### 1. Servicio: `user.service.ts`

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  nombre: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.com/usuario';

  constructor(private http: HttpClient) {}

  getUsuario(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

### 2. Componente: `user.component.ts` (suscripción manual)

```ts
import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  usuario?: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsuario('123').subscribe({
      next: (user) => this.usuario = user,
      error: (err) => console.error('Error:', err),
      complete: () => console.log('Petición completada')
    });
  }
}
```

### 3. Vista HTML: `user.component.html`

```html
<div *ngIf="usuario">
  <p>Nombre: {{ usuario.nombre }}</p>
  <p>Email: {{ usuario.email }}</p>
</div>
```

```txt
// Salida esperada en consola:
Petición completada

// Y en el navegador:
Nombre: Juan Pérez
Email: juan@example.com
```

---

## 🧪 Alternativa: uso del `async` pipe

### Componente: `user.component.ts` con `async`

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  usuario$: Observable<User>;

  constructor(private userService: UserService) {
    this.usuario$ = this.userService.getUsuario('123');
  }
}
```

### Vista HTML con `async` pipe

```html
<div *ngIf="usuario$ | async as usuario">
  <p>Nombre: {{ usuario.nombre }}</p>
  <p>Email: {{ usuario.email }}</p>
</div>
```

```txt
// Comportamiento del async pipe:
// - Se suscribe automáticamente al Observable
// - Muestra el valor cuando está disponible
// - Se desuscribe automáticamente al destruir el componente
```

