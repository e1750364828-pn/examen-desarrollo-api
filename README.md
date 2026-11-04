# examen-desarrollo-api

Biblioteca universitaria con arquitectura hexagonal (Node, Express y TypeScript).

- **Variante:** B — Member (socio), rutas `/members`
- **Almacenamiento:** Opción A — PostgreSQL con `pg` (SQL a mano, `db/schema.sql`)

## Estructura del módulo

```
src/modules/members/
  domain/        Member, NewMember y parseNewMember (reglas de validación)
  ports/         MemberRepository (findAll, findById, save, deactivate)
  application/   MemberService (list, getById, create, deactivate)
  adapters/
    http/        memberRoutes
    persistence/ InMemoryMemberRepository y PostgresMemberRepository
```

El ensamblado se hace solo en `src/app.ts`: con `MEMBERS_ADAPTER=sql` y `DATABASE_URL` definida se usa
PostgreSQL; en cualquier otro caso se usa la memoria (con un aviso por consola).

## Puesta en marcha

```bash
npm install
cp .env.example .env   # completar la contraseña de PostgreSQL
psql -U postgres -c "CREATE DATABASE library_dev"
psql -U postgres -c "CREATE DATABASE library_test"
psql -U postgres -d library_dev -f db/schema.sql
psql -U postgres -d library_test -f db/schema.sql
npm run dev
```

## Endpoints

| Método | Ruta                       | Éxito | Error                                      |
| ------ | -------------------------- | ----- | ------------------------------------------ |
| POST   | `/members`                 | 201   | 400 con el mensaje de la regla incumplida  |
| GET    | `/members`                 | 200   | —                                          |
| GET    | `/members/:id`             | 200   | 404 `Socio no encontrado`                  |
| PATCH  | `/members/:id/deactivate`  | 200   | 404 `Socio no encontrado` (ampliación)     |

Ejemplo:

```json
{ "name": "Lucía Mendoza", "email": "lucia.mendoza@correo.com", "membershipType": "estudiante" }
```

## Pruebas

```bash
npm test                 # dominio, servicio, adaptador en memoria y rutas
npm run test:integration # PostgreSQL con TEST_DATABASE_URL (distinta de DATABASE_URL)
npm run build
```

La prueba de integración falla de inmediato si `TEST_DATABASE_URL` no está definida o es igual a `DATABASE_URL`.

## Postman

Importar `postman/Library.postman_collection.json` (Collection v2.1) y ejecutar la carpeta **Members**
con el servidor encendido.
