# Angular Admin

A simple admin dashboard built with Angular, Tailwind CSS, and a C# Web API backend. This application allows users to read and upload blog posts, while administrators have the ability to manage user roles.

## Features

- **User Authentication:** Secure login and registration system.
- **Blog Management:** Users can create and read blog posts.
- **Markdown Support:** Blog content is rendered from Markdown for easy editing.
- **Role Management:** Administrators can view and manage user roles.
- **Responsive Design:** Styled with Tailwind CSS for a modern, responsive UI.

## Tech Stack

### Frontend

- **Framework:** Angular (latest, v20+)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4
- **State Management:** Angular Signals & RxJS
- **Markdown:** `ngx-markdown` for rendering

### Backend

- **Platform:** C# Web API
- *Note: The backend is managed in a separate repository and is required for the application to function. [Link to the backend project](https://github.com/Yannick-Vk/Angular-Admin-Web-Api)*

## How It Works

### Authentication

The application uses a robust, secure authentication flow leveraging JWTs with an access/refresh token pattern, implemented via `HttpOnly` cookies.

1.  **Login:** The user logs in, and the backend provides two `HttpOnly` cookies:
    *   A short-lived **access token**.
    *   A long-lived **refresh token**.

2.  **Authenticated Requests:** An `HttpInterceptor` (`auth.interceptor.ts`) automatically includes credentials (`withCredentials: true`) on all outgoing requests to the API. The browser attaches the cookies.

3.  **Automatic Token Refresh:** When the access token expires, the API returns a `401 Unauthorized` error.
    *   A second `HttpInterceptor` (`error.interceptor.ts`) catches this specific error.
    *   It automatically and silently calls a `/auth/refresh` endpoint. The browser sends the secure refresh token cookie with this request.
    *   The backend validates the refresh token and returns a new access token (and potentially a new refresh token).
    *   The interceptor then retries the original, failed request with the new session.

This process is completely seamless to the user and enhances security by keeping tokens out of browser-accessible storage (like `localStorage`) and ensuring access tokens expire quickly.

### Project Structure

The frontend code is organized in the `src/app` directory, with a clear separation of concerns:
-   `components/`: Reusable components used across the application.
-   `pages/`: Smart components that represent the different pages/routes.
-   `services/`: Services that handle API communication and other business logic (`AuthService`, `BlogService`, etc.).
-   `models/`: TypeScript interfaces for data structures like `User` and `Blog`.
-   `guards/`: Route guards to protect parts of the application.
-   `interceptors/`: Contains Angular `HttpInterceptor` functions. These globally handle outgoing API requests and incoming responses for tasks like attaching credentials and automatically refreshing expired tokens.

## Getting Started

### Prerequisites

-   **Node.js:** A recent LTS version is recommended (e.g., 20.x or later).
-   **Package Manager:** `npm` (comes with Node.js) or `bun`.
-   **Backend API:** A running instance of the backend C# Web API. You can find the backend repository and setup instructions [here](https://github.com/Yannick-Vk/Angular-Admin-Web-Api).
    -   *Note: The application is configured to communicate with an API at `https://localhost:7134`. If your backend runs on a different address, you will need to update the API base URL in the Angular services.*

### Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd angular-admin
    ```

2.  **Install dependencies:**
    This project includes a `bun.lock` file. If you have `bun` installed, use:
    ```sh
    bun install
    ```
    Otherwise, you can use `npm`:
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm start
    ```
    The application will be available at `http://localhost:4200`.

## Available Scripts

-   `npm start`: Runs the app in development mode with live reloading.
-   `npm run build`: Compiles and builds the application for production into the `dist/` folder.
-   `npm test`: Launches the test runner and executes unit tests via Karma.
