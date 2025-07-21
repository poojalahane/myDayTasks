# Technical Interview Assessment

Welcome to the Technical Interview for the Full Stack Developer position at Stratex Aus! This assessment is designed to evaluate your proficiency in both frontend and backend development using our specified tech stack.

## **Overview**

You will be enhancing and extending the existing **Todo Management System** to include additional features and improvements. This will involve creating new functionalities, optimizing existing code, and ensuring best practices are followed throughout the development process. The architecture follows Domain-Driven Design (DDD) and the Controller-Service-Repository pattern, providing a solid foundation for your implementations.

## **Getting Started**

1. **Follow the instructions in the `README.md` file in each directory to set up the project environment.**

## **Tasks to Accomplish**

### **1. Implement User Authentication**

- **Objective:** Add user registration and login functionalities to secure the Todo Management System.
- **Tasks:**
  - **Model Creation:** Define a `User` model with fields such as `id`, `username`, `email`, `password`, `createdAt`, and `updatedAt`.
  - **Authentication Endpoints:**
    - **Register:** Create an endpoint to handle user registration, including password hashing.
    - **Login:** Create an endpoint to authenticate users and issue JWTs.
  - **Middleware:** Develop authentication middleware to protect Todo-related routes, ensuring only authenticated users can access them.
  - **Frontend Integration:**
    - Create registration and login forms.
    - Manage authentication state using Context API or a state management library.
    - Protect frontend routes to restrict access to authenticated users only.

### **2. Enhance Todo Functionality with Categories and Tags**

- **Objective:** Allow users to categorize and tag their todos for better organization and filtering.
- **Tasks:**
  - **Models:**
    - **Category:** Define a `Category` model with fields like `id`, `name`, and `description`.
    - **Tag:** Define a `Tag` model with fields like `id` and `name`.
    - **Relationships:** Establish many-to-many relationships between `Todo` and `Tag`, and one-to-many between `User` and `Category`.
  - **CRUD Operations:**
    - Implement CRUD endpoints for `Category` and `Tag`.
    - Update Todo creation and update endpoints to associate categories and tags.
  - **Frontend Integration:**
    - Update the Todo form to include category selection and tag inputs.
    - Display categories and tags in the Todo list.
    - Implement filtering options based on categories and tags.

### **3. Implement Advanced Search and Filtering**

- **Objective:** Enable users to perform advanced searches and filter their todos based on various criteria.
- **Tasks:**
  - **Backend:**
    - Develop endpoints that accept query parameters for filtering todos by status, due date, category, tags, and search keywords.
    - Optimize database queries to handle complex filtering efficiently.
  - **Frontend:**
    - Create a search bar and filtering UI components.
    - Integrate frontend with backend search and filtering endpoints.
    - Display filtered results dynamically as users apply filters.

### **4. Add Real-Time Updates with WebSockets**

- **Objective:** Provide real-time updates to the Todo list when changes occur, enhancing user experience.
- **Tasks:**
  - **Backend:**
    - Integrate WebSocket support using libraries like `Socket.IO`.
    - Emit events on todo creation, updates, and deletions.
  - **Frontend:**
    - Establish WebSocket connections to listen for real-time events.
    - Update the Todo list in real-time as events are received.

### **5. Optimize Performance and Implement Caching**

- **Objective:** Improve application performance by implementing caching strategies for frequently accessed data.
- **Tasks:**
  - **Frontend:**
    - Optimize API calls to leverage cached data when appropriate.
    - Implement lazy loading for large datasets to enhance performance.

### **6. Implement Comprehensive Error Handling and Validation**

- **Objective:** Ensure robust error handling and data validation across the application to maintain reliability and security.
- **Tasks:**
  - **Backend:**
    - Enhance existing error-handling middleware to cover new endpoints and scenarios.
    - Implement validation for all incoming data using libraries like `Joi` or `class-validator`.
  - **Frontend:**
    - Display meaningful error messages to users based on backend responses.
    - Implement client-side validation to complement server-side checks.

### **7. Write Unit and Integration Tests**

- **Objective:** Ensure code reliability and maintainability by writing comprehensive tests.
- **Tasks:**
  - **Backend:**
    - Write unit tests for controllers, services, and repositories using testing frameworks like `Jest`.
    - Implement integration tests for API endpoints to verify end-to-end functionality.
  - **Frontend:**
    - Write unit tests for React components using `React Testing Library` or similar tools.
    - Implement end-to-end tests for critical user flows using tools like `Cypress`.

### **8. Refactor and Optimize Codebase**

- **Objective:** Improve code quality and maintainability by refactoring existing code and optimizing performance.
- **Tasks:**
  - **Backend:**
    - Review and refactor existing controllers, services, and repositories for better readability and efficiency.
    - Optimize database queries to reduce latency and improve performance.
    - Ensure adherence to SOLID principles and best practices.
  - **Frontend:**
    - Refactor React components to enhance reusability and maintainability.
    - Optimize state management to prevent unnecessary re-renders and improve performance.
    - Ensure code follows consistent styling and formatting guidelines.

### **9. Deploy the Application (Optional)**

- **Objective:** Demonstrate the ability to deploy the application using containerization and cloud services.
- **Tasks:**
  - **Containerization:**
    - Dockerize both backend and frontend applications.
    - Create `Dockerfile` and `docker-compose.yml` for orchestrating multi-container setups.
  - **Deployment:**
    - Deploy the application to a cloud platform (e.g., AWS, Heroku, Docker Hub).
    - Set up environment variables and ensure secure handling of sensitive information.
  - **CI/CD Integration:**
    - Implement basic Continuous Integration and Continuous Deployment pipelines using tools like GitHub Actions or Jenkins.

## **Submission Guidelines**

During the live technical interview, you will be asked to:

1. **Share Your Screen:** Ensure your development environment is visible to the interviewer.
2. **Explain Your Thought Process:** As you work through the tasks, articulate your decisions and approach.
3. **Demonstrate Functionality:** After implementation, showcase the working features and explain how you structured your code.
4. **Discuss Potential Improvements:** Mention any optimizations or additional features you would implement given more time.

## **Helpful Resources**

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/en/4x/api.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://jwt.io/introduction/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Documentation](https://docs.docker.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)

## **Good Luck!**

We’re excited to see your implementation and discuss your approach. If you have any questions during the assessment, feel free to ask the interviewer.

---

# Additional Notes

- **Time Management:** Prioritize core functionalities first. Allocate your time effectively to cover as much as possible.
- **Critical Thinking:** Make design decisions that showcase your understanding of full-stack development and architectural patterns.
- **Problem-Solving:** Demonstrate your ability to troubleshoot and resolve issues independently.
- **Code Quality:** Focus on writing clean, maintainable, and well-documented code.
- **Communication:** Clearly explain your approach and reasoning throughout the interview.

# Best of Luck!