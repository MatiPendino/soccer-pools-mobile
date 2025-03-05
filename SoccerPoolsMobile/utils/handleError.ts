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