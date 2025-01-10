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
- Social Google OAuth
- Built using React Native and Expo
- Integrated with the [SoccerPools API](https://github.com/MatiPendino/soccer-pools-api)

## Requirements

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Installation and Setup

Follow these steps to set up and run the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/MatiPendino/soccer-pools-mobile.git
    cd soccer-pools-mobile
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an `.env` file at the root of the project and specify the required environment variables:
    ```env
    API_URL=http://localhost:8000
    ANDROID_CLIENT_ID=your_android_client_id
    ```

4. Start the Expo development server:
    ```bash
    npx expo start
    ```

5. Scan the QR code with your Expo Go app to test the application on your device.

## Running Tests

You can run the test suite using the following command:
```bash
npm test
```

## Backend Integration
This frontend is designed to work with the [SoccerPools API](https://github.com/MatiPendino/soccer-pools-api).

## Contributing
1. Fork the repository

2. Create a new branch (git checkout -b feature-name)

3. Make your changes and commit them (git commit -m 'Add new feature')

4. Push the changes to your branch (git push origin feature-name)

5. Create a Pull Request

## License
This project is licensed under the MIT License.
