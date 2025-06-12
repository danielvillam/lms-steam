# Documentación de la Base de Datos -  Aplicativo Web para la Gestión del Aula STEAM

Este documento describe la estructura actual de la base de datos del aplicativo web para la gestión del Aula STEAM, incluyendo modelos, campos, relaciones y características clave.

## Cursos y estructura general
- `Course`
- `Category`
- `Module`
- `Attachment`

## Progreso y participación
- `UserProgress`
- `Registration`
- `Rating`
- `Certificate`

## Evaluaciones y resultados
- `EvaluationType` (enum)
- `Evaluation`
- `Question`
- `Answer`
- `EvaluationResult`
- `SelectedAnswer`

---

## Modelo: `Course`

| Campo           | Tipo     | Descripción                               |
| --------------- | -------- | ----------------------------------------- |
| id              | String   | Identificador único del curso             |
| userId          | String   | ID del usuario que creó el curso          |
| title           | String   | Título del curso                          |
| description     | String?  | Descripción general del curso             |
| imageUrl        | String?  | URL de la imagen representativa del curso |
| previousSkills  | String?  | Habilidades previas esperadas             |
| developedSkills | String?  | Habilidades desarrolladas al finalizar    |
| level           | String?  | Nivel de dificultad                       |
| price           | Float?   | Precio del curso                          |
| isPublished     | Boolean  | Estado de publicación del curso           |
| categoryId      | String?  | ID de la categoría                        |
| createdAt       | DateTime | Fecha de creación                         |
| updatedAt       | DateTime | Fecha de última actualización             |

**Relaciones:**

* `category`: relación opcional con `Category`
* `modules`: módulos del curso
* `attachments`: archivos adjuntos
* `registered`: usuarios registrados
* `certificates`: certificaciones de los estudiantes
* `ratings`: calificaciones dejadas por los estudiantes

---

## Modelo: `Category`

| Campo | Tipo   | Descripción                  |
| ----- | ------ | ---------------------------- |
| id    | String | Identificador único          |
| name  | String | Nombre único de la categoría |

**Relaciones:**

* `courses`: cursos asociados a esta categoría

---

## Modelo: `Attachment`

| Campo     | Tipo     | Descripción                |
| --------- | -------- | -------------------------- |
| id        | String   | Identificador del adjunto  |
| name      | String   | Nombre del archivo         |
| url       | String   | URL del archivo            |
| courseId  | String   | Curso al que está asociado |
| createdAt | DateTime | Fecha de creación          |
| updatedAt | DateTime | Fecha de actualización     |

**Relaciones:**

* `course`: curso asociados a el archivo adjunto

---

## Modelo: `Module`

| Campo             | Tipo            | Descripción                   |
|-------------------|-----------------|-------------------------------|
| id                | String          | Identificador del módulo      |
| title             | String          | Título del módulo             |
| description       | String?         | Descripción del módulo        |
| videoUrl          | String?         | URL del video                 |
| videoTranscript   | String?         | Transcripción del video       |
| position          | Int             | Orden del módulo              |
| isPublished       | Boolean         | Estado de publicación         |
| isEnabled         | Boolean         | Si el módulo está habilitado  |
| isEvaluable       | Boolean         | Si el módulo es evaluable     |
| evaluationMethod  | EvaluationType? | Tipo de evaluación            |
| courseId          | String          | ID del curso al que pertenece |
| createdAt         | DateTime        | Fecha de creación             |
| updatedAt         | DateTime        | Fecha de actualización        |

**Relaciones:**

* `course`: curso al que pertenece el módulo
* `userProgress`: progreso de los usuarios
* `evaluation`: evaluación del módulo

---

## Modelo: `UserProgress`

| Campo       | Tipo     | Descripción                 |
|-------------| -------- |-----------------------------|
| id          | String   | Identificador del progreso  |
| userId      | String   | ID del usuario              |
| moduleId    | String   | ID del módulo               |
| isCompleted | Boolean  | Si el módulo fue completado |
| createdAt   | DateTime | Fecha de creación           |
| updatedAt   | DateTime | Fecha de actualización      |

**Relaciones:**

* `module`: módulo al que pertenece el rogreso

---

## Modelo: `Registration`

| Campo     | Tipo     | Descripción            |
| --------- | -------- | ---------------------- |
| id        | String   | ID del registro        |
| userId    | String   | ID del estudiante      |
| courseId  | String   | ID del curso           |
| createdAt | DateTime | Fecha de inscripción   |
| updatedAt | DateTime | Fecha de actualización |

**Relaciones:**

* `course`: curso al que se registró

---

## Modelo: `Rating`

Permite a los estudiantes dejar una calificación opcional al finalizar el curso.

| Campo     | Tipo     | Descripción                        |
| --------- | -------- | ---------------------------------- |
| id        | String   | Identificador único                |
| userId    | String   | ID del estudiante que califica     |
| courseId  | String   | ID del curso calificado            |
| rating    | Int      | Puntuación del curso (1 a 5)       |
| comment   | String?  | Comentario opcional sobre el curso |
| createdAt | DateTime | Fecha de creación                  |
| updatedAt | DateTime | Fecha de última actualización      |

**Relaciones:**

* `course`: curso al que pertenece la calificación

---

## Enumeración: `EvaluationType`

Define los tipos de evaluación disponibles para los módulos del curso. Este `enum` permite aplicar diferentes lógicas de evaluación según el objetivo pedagógico.

| Valor      | Descripción                                                             |
|------------|-------------------------------------------------------------------------|
| `sequence` | El estudiante debe ordenar correctamente una serie de pasos o procesos. |
| `locate`   | El estudiante debe ubicar partes o elementos en un diagrama o imagen.   |
| `single`   | Preguntas con opciones múltiples pero solo una respuesta correcta.      |
| `multiple` | Preguntas con varias respuestas correctas posibles.                     |
| `open`     | Preguntas que tienen una respuesta abierta                              |

> Este `enum` puede ampliarse en el futuro para incluir otros tipos como arrastrar y soltar, emparejamiento, entre otros.

**Relaciones:**

* `evaluation`: evaluacion a la que pertenecen los resultados

---

## Modelo: `Evaluation`

| Campo        | Tipo           | Descripción                                        |
|--------------|----------------|----------------------------------------------------|
| id           | String         | Identificador único                                |
| type         | EvaluationType | Tipo de evaluación                                 |
| maxAttempts  | Int?           | Número máximo de intentos para pasar la evaluación |
| moduleId     | String         | ID del módulo                                      |
| isPublished  | Boolean        | Estado de la publicación                           |
| createdAt    | DateTime       | Fecha de creación                                  |
| updatedAt    | DateTime       | Fecha de actualización                             |


**Relaciones:**

* `module`: módulo al que pertenece la evaluación
* `questions`: preguntas de la evaluación
* `evaluationResults`: resultado de las evaluaciones

---

## Modelo: `Question`

| Campo        | Tipo     | Descripción            |
|--------------|----------|------------------------|
| id           | String   | Identificador único    |
| title        | String   | Título de la pregunta  |
| evaluationId | String   | ID de la evaluación    |
| createdAt    | DateTime | Fecha de creación      |
| updatedAt    | DateTime | Fecha de actualización |


**Relaciones:**

* `evaluation`: evaluación asociada a la pregunta
* `answers`: respuestas a la pregunta
* `selectedAnswers`: respuestas seleccionadas por los estudiantes

---

## Modelo: `Answer`

| Campo      | Tipo     | Descripción                        |
|------------|----------|------------------------------------|
| id         | String   | Identificador único                |
| title      | String   | Título de la respuesta             |
| questionId | String   | ID de la pregunta                  |
| isCorrect  | Boolean  | Estado si la respuesta es correcta |
| createdAt  | DateTime | Fecha de creación                  |
| updatedAt  | DateTime | Fecha de actualización             |

**Relaciones:**

* `question`: pregunta asociada a la respuesta

---

## Modelo: `EvaluationResult`

| Campo        | Tipo     | Descripción                                                  |
|--------------|----------|--------------------------------------------------------------|
| id           | String   | Identificador único                                          |
| userId       | String   | ID del estudiante que resuelve la evaluación                 |
| evaluationId | String   | ID de la evaluación que resuelve                             |
| attempt      |  Int     | Número de intento del usuario. Ej: 1 para el primer intento. |
| score        | Float    | Puntaje de la evaluación                                     |
| completedAt  | DateTime | Fecha en la cual se completó                                 |

**Relaciones:**

* `evaluation`: evaluation a la que pertenecen los resultados
* `answers`: respuestas seleccionadas en la evaluación

---

## Modelo: `SelectedAnswer`

| Campo              | Tipo     | Descripción                        |
|--------------------|----------|------------------------------------|
| id                 | String   | Identificador único                |
| title              | String   | Título de la respuesta             |
| evaluationResultId | String   | ID de la evaluación resultado      |
| questionId         | String   | ID de la pregunta realizada        |
| isCorrect          | Boolean  | Estado si la respuesta es correcta |

**Relaciones:**

* `evaluationResult`: grupo de respuestas correspondiente a un intento específico del usuario.
* `question`: pregunta de la evaluación

---

## Modelo: `Certificate`

| Campo          | Tipo       | Descripción                       |
|----------------|------------|-----------------------------------|
| id             | String     | Identificador único               |
| userId         | String     | ID del estudiante del certificado |
| courseId       | String     | ID del curso finalizado           |
| issuedAt       | DateTime   | Fecha certificación               |
| certificateUrl | String?    | Url del certificado               |
| createdAt      | DateTime   | Fecha de creación                 |
| updatedAt      | DateTime   | Fecha de actualización            |

**Relaciones:**

* `course`: curso a la que pertenece el certificado

---

## Gestión de Usuarios

La aplicación utiliza [Clerk](https://clerk.dev/) como proveedor de autenticación y gestión de usuarios. Por esta razón, no se utiliza un modelo `User` en la base de datos propia.

En su lugar, se almacena únicamente el `userId` (generado por Clerk) en los modelos que requieren asociación con un usuario:

| Modelo            | Campo utilizado |
|-------------------|-----------------|
| `Registration`     | `userId: String` |
| `Certificate`      | `userId: String` |
| `Rating`           | `userId: String` |
| `UserProgress`     | `userId: String` |
| `EvaluationResult` | `userId: String` |

> ⚠️ Estos campos se usan solo como identificador de referencia. Cualquier información adicional del usuario (como nombre, email o rol) se gestiona directamente desde la API de Clerk y no se almacena en la base de datos.

### ¿Y el modelo `User`?

Existe un modelo `User` comentado en el esquema de Prisma como referencia futura. Si en algún momento se decide migrar la gestión de usuarios a una base de datos propia, puede activarse y sincronizar con Clerk vía webhooks o tareas programadas.

---

## Convenciones

- Todos los identificadores son de tipo `String` y corresponden a `ObjectId` de MongoDB.
- Los campos opcionales están marcados como `Tipo?`.
- Las fechas usan el tipo `DateTime` y están en formato ISO.
