You're absolutely right. Let me add markdown styles while preserving ALL the original instructions and details:

# Backend Implementation Tasks

## 1. Establishing the Assignable Users Endpoint

To allow the frontend to populate the assignee dropdown menu, we need a dedicated backend endpoint that provides a simplified list of users. This involves several coordinated steps:

### 1.1 Define a Data Transfer Object (DTO)
- [ ] Create `UserSummaryDTO` in `backend/src/main/java/com/taskflow/backend/dto/`
- [ ] Include essential fields: `id` (as `Long`) and `name` (as `String`)
- [ ] **Implementation Note**: Using a Java Record for this DTO is often the most concise approach

### 1.2 Implement Service Layer Method  
- [ ] Add `getAssignableUsers()` method to `UserService` (`backend/src/main/java/com/taskflow/backend/service/`)
- [ ] Return type: `List<UserSummaryDTO>`
- [ ] **Implementation Options**:
  - [ ] **Option A**: Define a specific query in the `UserRepository` (e.g., using `@Query("SELECT new com.taskflow.backend.dto.UserSummaryDTO(u.id, u.name) FROM User u ...")`) to fetch only the required fields directly from the database for efficiency
  - [ ] **Option B**: Fetch the full `User` entities and then map them to `UserSummaryDTO` objects within the service method using Java Streams

### 1.3 Create Controller Endpoint
- [ ] Add new method to `UserController` (`backend/src/main/java/com/taskflow/backend/controller/`)
- [ ] Annotation: `@GetMapping("/assignable")`
- [ ] Method should call `userService.getAssignableUsers()`
- [ ] Wrap result in standard `ApiResponse` before returning
- [ ] Return as `ResponseEntity<ApiResponse<List<UserSummaryDTO>>>`
- [ ] **Result**: Creates the `GET /api/v1/users/assignable` endpoint for the frontend to consume

## 2. Synchronizing Task Data Representation

A critical step is ensuring the backend's representation of a 'Task' aligns precisely with the frontend's expectations defined in `frontend/src/types/task.types.ts`. This requires examining and potentially modifying the `Task` entity, the `TaskRequest` DTO, creating a `TaskResponseDTO`, and implementing mapping logic.

### 2.1 Update Task Entity
- [ ] Compare frontend `Task` type with existing `Task.java` entity (`backend/src/main/java/com/taskflow/backend/model/`)
- [ ] Ensure entity includes corresponding fields:
  - [ ] `title` (String)  
  - [ ] `description` (String)
  - [ ] `status` (String)
  - [ ] `priority` (String)
  - [ ] `type` (String)
  - [ ] `storyPoints` (Integer)
  - [ ] `dueDate` (LocalDateTime/LocalDate)
  - [ ] `createdAt` (LocalDateTime)
  - [ ] `updatedAt` (LocalDateTime)
- [ ] Set up relationships:
  - [ ] Represent `assignee` using `@ManyToOne` relationship to the `User` entity
  - [ ] Handle `labels` and `dependencies` (which are string arrays in the frontend) using:
    - [ ] JPA's `@ElementCollection`, or
    - [ ] `@ManyToMany` relationship if dependencies refer to other tasks
- [ ] Add lifecycle callbacks:
  - [ ] Use `@PrePersist` to automatically manage `createdAt` timestamp
  - [ ] Use `@PreUpdate` to automatically manage `updatedAt` timestamp

### 2.2 Adapt TaskRequest DTO
- [ ] Update `TaskRequest.java` (`backend/src/main/java/com/taskflow/backend/dto/`)
- [ ] **Purpose**: Used to receive data *from* the frontend during task creation (`POST`) and updates (`PUT`)
- [ ] Include fields for all data the frontend might send:
  - [ ] `title`
  - [ ] `description`
  - [ ] `status`
  - [ ] `priority`
  - [ ] `type`
  - [ ] `storyPoints`
  - [ ] `labels`
  - [ ] `dependencies`
- [ ] **Important**: For the assignee, expect the user's ID (e.g., `Long assigneeId`) rather than a complex `User` object
- [ ] For dates like `dueDate`, consider accepting a `String` if the frontend sends a specific format (e.g., 'YYYY-MM-DD'), which can then be parsed in the service layer

### 2.3 Create TaskResponseDTO
- [ ] Create `TaskResponseDTO.java` (`backend/src/main/java/com/taskflow/backend/dto/`)
- [ ] **Purpose**: Defines the exact structure of task data sent *to* the frontend
- [ ] **Rationale**: The existing `TaskController` likely returns the full `Task` entity, which might contain sensitive or unnecessary information or require specific formatting
- [ ] Include all fields the frontend needs:
  - [ ] `id`
  - [ ] `title`
  - [ ] `description`
  - [ ] `status`
  - [ ] `priority`
  - [ ] `type`
  - [ ] `storyPoints`
  - [ ] For the `assignee`: include both `assigneeId` and `assigneeName` for easy display
  - [ ] Dates: `dueDate`, `createdAt`, `updatedAt` (formatted as Strings, e.g., ISO 8601 standard) for consistent handling across the frontend
  - [ ] Collections: `labels` and `dependencies` (as `List<String>`)

### 2.4 Implement Mapping Logic
- [ ] Create `TaskMapper` class (`backend/src/main/java/com/taskflow/backend/mapper/`)
- [ ] **Purpose**: Handle conversions between different representations (`TaskRequest` -> `Task` entity -> `TaskResponseDTO`)
- [ ] **Implementation Options**:
  - [ ] Write manual mapping methods
  - [ ] Leverage a library like MapStruct (if available in the project) to automate the generation of this boilerplate code
- [ ] **Usage**: This mapper will be used within the `TaskService` to:
  - [ ] Convert incoming `TaskRequest` objects to `Task` entities before saving
  - [ ] Convert `Task` entities fetched from the database into `TaskResponseDTO` objects before sending them back to the controller

## 3. Verifying and Updating Controller Endpoints

After creating the new DTOs and mappers, revisit the existing `TaskController.java`. 

### 3.1 Update TaskController Methods
- [ ] Modify methods that return task data:
  - [ ] `getAllTasks` at `GET /` → return `TaskResponseDTO` or `Page<TaskResponseDTO>`
  - [ ] `getTask` at `GET /{id}` → return `TaskResponseDTO` instead of raw `Task` entity
- [ ] Ensure methods handling creation and updates correctly accept `TaskRequest` DTO:
  - [ ] `POST /` → accept `TaskRequest` and utilize mapping logic within `TaskService`
  - [ ] `PUT /{id}` → accept `TaskRequest` and utilize mapping logic within `TaskService`
- [ ] Double-check that any pagination, filtering, or sorting parameters defined in the controller align with how the frontend intends to use them via `taskService.ts`

### 3.2 Review Related Controllers
- [ ] Check `CategoryController` for consistency in response structures (`ApiResponse`) and DTO usage
- [ ] Review relevant parts of `UserController` for consistency in response structures (`ApiResponse`) and DTO usage

### 3.3 Final Verification
- [ ] Test all modified endpoints
- [ ] Ensure DTO mappings work correctly
- [ ] Verify data flows properly between frontend and backend
- [ ] Test error handling scenarios
