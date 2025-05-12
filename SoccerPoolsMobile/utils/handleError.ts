import * as Sentry from "@sentry/react-native";

interface ErrorProps {
    error_type: string
    status_code: number
    errors: object
    details?: string
}

export default function handleError(error: ErrorProps): string {
    let errorMessage = ''

    if (error.details) {
        errorMessage = error.details
    } else {
        if (!error.errors) {
            Sentry.captureException(error)
            return 'An unexpected error occurred. Please try again later.'
        }
        let keys = Object.keys(error.errors);
        let lastKey = keys[keys.length - 1];

        for (let key in error.errors) {
            errorMessage += `${key.toUpperCase()}: ${error.errors[key][0]}`
            if (key !== lastKey) {
                errorMessage += '\n'
            }
        }
    }

    return errorMessage
}