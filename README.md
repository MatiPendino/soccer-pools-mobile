# Soccer Pools Mobile

This is the frontend for the Soccer Pools project, built using React Native and Expo. The project consists of a picking game where users predict the outcomes of all matches in a league and earn points based on their predictions:

- **3 points:** Exact result prediction
- **1 point:** Correct winner prediction
- **0 points:** Incorrect prediction

Users can create groups (called **tournaments**) to compete with their friends.

## Project Status

This project is currently in its early development stage and has not yet reached its first official version.

## Features

- Predict match outcomes and score points based on accuracy
- Rankings based on League and Stage
- Create and join tournaments to compete with friends
- Social Google OAuth authentication
- Internationalization (i18n) support via i18next
- Push notifications via Expo Notifications
- Firebase Analytics integration
- Error tracking with Sentry
- Built using React Native and Expo
- Integrated with the [SoccerPools API](https://github.com/MatiPendino/soccer-pools-api)

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 52)
- **Navigation:** [Expo Router](https://expo.github.io/router/) v4 with React Navigation
- **State Management / Data Fetching:** [TanStack React Query](https://tanstack.com/query)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **UI:** React Native Paper, Expo Linear Gradient, FontAwesome icons
- **Internationalization:** i18next + react-i18next + expo-localization
- **Analytics:** Firebase Analytics, Vexo Analytics
- **Error Tracking:** Sentry
- **Language:** TypeScript

## Requirements

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation and Setup

Follow these steps to set up and run the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/MatiPendino/soccer-pools-mobile.git
    cd soccer-pools-mobile/SoccerPoolsMobile
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an `.env` file at the root of the `SoccerPoolsMobile` directory and specify the required environment variables:
    ```env
    API_URL=http://localhost:8000
    ANDROID_CLIENT_ID=your_android_client_id
    ```

4. Start the Expo development server:
    ```bash
    npx expo start
    ```

5. Choose one of the following to run the app:
   - Press `a` to open on an Android emulator
   - Press `i` to open on an iOS simulator
   - Scan the QR code with the **Expo Go** app to test on a physical device

## Running Tests

You can run the test suite from inside the `SoccerPoolsMobile` directory:
```bash
npm test
```

## Project Structure

```
soccer-pools-mobile/
└── SoccerPoolsMobile/
    ├── app/          # Expo Router screens and layouts
    ├── assets/       # Images, fonts, and other static assets
    ├── components/   # Reusable UI components
    ├── contexts/     # React context providers
    ├── hooks/        # Custom React hooks
    ├── locales/      # i18n translation files
    ├── modals/       # Modal components
    ├── services/     # API service functions
    ├── theme/        # Theming and style constants
    ├── types.ts      # Shared TypeScript types
    └── utils/        # Utility functions
```

## Backend Integration

This frontend is designed to work with the [SoccerPools API](https://github.com/MatiPendino/soccer-pools-api).

## Contributing

1. Fork the repository

2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```

3. Make your changes and commit them:
    ```bash
    git commit -m 'Add new feature'
    ```

4. Push the changes to your branch:
    ```bash
    git push origin feature-name
    ```

5. Create a Pull Request

## License

This project is licensed under the MIT License.
