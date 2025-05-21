# NestJS con TypeORM y PostgreSQL: ejemplo Users y Photos

---

## 📘 ¿Qué es TypeORM?

**TypeORM** es un Object-Relational Mapper (ORM) para Node.js escrito en TypeScript. Permite interactuar con bases de datos relacionales mediante clases y objetos, sin escribir SQL directamente.

### ✅ Ventajas
- **Integración nativa con TypeScript**: soporte completo de tipos.
- **Abstracción del acceso a datos**: operaciones complejas con poco código.
- **Migraciones integradas**: control de cambios en la base de datos.
- **Soporte para relaciones**: `OneToMany`, `ManyToOne`, `ManyToMany`, etc.
- **Multibase de datos**: PostgreSQL, MySQL, SQLite, etc.
- **Estilos Active Record y Data Mapper**.

### ❌ Desventajas
- **Mantenimiento irregular**: algunas versiones pueden tener bugs.
- **Curva de aprendizaje**: requiere conocer conceptos de ORM y TypeScript.
- **Consultas complejas menos eficientes**: a veces es mejor usar SQL puro.
- **Migraciones limitadas**: menos flexible que herramientas especializadas.

### 🛠️ Buenas prácticas
- Usa **DTOs** para separar validación de entrada de las entidades.
- Define relaciones usando `@OneToMany`, `@ManyToOne`, etc. con cuidado.
- **Evita `synchronize: true` en producción**: mejor usar migraciones.
- Valida entrada con `class-validator` y `class-transformer`.
- Mantén separación clara entre servicios, controladores y repositorios.
- Versiona tu base de datos con migraciones revisadas.
- Usa carga explícita de relaciones en lugar de `eager: true` por defecto.

---

Este ejemplo indica el paso a paso para implementar un CRUD con las entidades `Users` y `Photos` usando TypeORM y PostgreSQL.

## 🧾 Paso 1: Instalar dependencias

```bash
npm install @nestjs/typeorm typeorm pg
```

---

## 📦 Paso 2: Crear los módulos

```bash
nest g module users
nest g service users
nest g controller users

nest g module photos
nest g service photos
nest g controller photos
```

---

## 🏗️ Paso 3: Configurar la conexión en `app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { User } from './users/user.entity';
import { Photo } from './photos/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tu_usuario',
      password: 'tu_contraseña',
      database: 'mi_base_de_datos',
      entities: [User, Photo],
      synchronize: true, // solo en desarrollo
    }),
    UsersModule,
    PhotosModule,
  ],
})
export class AppModule {}
```

---

## 🗃️ Paso 4: Crear las entidades

### `user.entity.ts`

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Photo } from '../photos/photo.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
```

### `photo.entity.ts`

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User;
}
```

---

## 🛠️ Paso 5: Registrar entidades en sus módulos

### `users.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### `photos.module.ts`

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './photo.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
```

---

## 🧠 Paso 6: Implementar servicios y controladores

Sigue una lógica similar a la del CRUD anterior, adaptando nombres a `User` y `Photo`.


## 🔧 CRUD de Users

### `users.service.ts`

```ts
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: CreateUserDto) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({ relations: ['photos'] });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['photos'] });
  }

  async update(id: string, data: UpdateUserDto) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
```

### `users.controller.ts`

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

---

## 🖼️ CRUD de Photos

### `photos.service.ts`

```ts
@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo) private photoRepo: Repository<Photo>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(data: CreatePhotoDto) {
    const user = await this.userRepo.findOneBy({ id: data.userId });
    const photo = this.photoRepo.create({ url: data.url, user });
    return this.photoRepo.save(photo);
  }

  findAll() {
    return this.photoRepo.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.photoRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async update(id: string, data: UpdatePhotoDto) {
    await this.photoRepo.update(id, { url: data.url });
    return this.findOne(id);
  }

  async remove(id: string) {
    const photo = await this.findOne(id);
    return this.photoRepo.remove(photo);
  }
}
```

### `photos.controller.ts`

```ts
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() dto: CreatePhotoDto) {
    return this.photosService.create(dto);
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePhotoDto) {
    return this.photosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photosService.remove(id);
  }
}
```

---

## ✍️ DTOs de ejemplo

### `create-user.dto.ts`

```ts
export class CreateUserDto {
  name: string;
  email: string;
}
```

### `update-user.dto.ts`

```ts
export class UpdateUserDto {
  name?: string;
  email?: string;
}
```

### `create-photo.dto.ts`

```ts
export class CreatePhotoDto {
  userId: string;
  url: string;
}
```

### `update-photo.dto.ts`

```ts
export class UpdatePhotoDto {
  url: string;
}
```