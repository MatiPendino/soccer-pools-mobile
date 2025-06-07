
const convertToBlob = (logo: string): File => {
    // Convert Base64-encoded data URL to Blob file
    const arr = logo.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const byteString = atob(arr[1]);
    let n = byteString.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = byteString.charCodeAt(n);
    }

    const blob = new Blob([u8arr], { type: mime });
    return new File([blob], 'logo.jpg', { type: mime }); 
}

const createLogoFile = (logo: string) => {
    let logoFile;
    if (logo.startsWith('data:image')) {
        // Web case - convert to Blob
        logoFile = convertToBlob(logo);
    } else {
        // Mobile case - use URI as is
        logoFile = {
            uri: logo,
            name: logo.split('/').pop(),
            type: 'image/jpeg',
        };
    }

    return logoFile
}

export const generateTournamentFormData = (
    name: string, description: string, logo: string, leagueId?: number
): FormData => {
    const formData = new FormData()

    if (logo){
        /* 
        If the logo is a URL, it means that it is an already created tournament which logo has not
        been updated, so there is no need to append it to the form data
        */
        if (!logo.startsWith('https://')) {
            const logoFile = createLogoFile(logo)            
            // @ts-ignore
            formData.append('logo', logoFile)  
        } 
    } else {
        formData.append('logo', null)
    }
    formData.append('name', name)
    formData.append('description', description)
    if (leagueId) {
        formData.append('league', String(leagueId))
    }

    return formData
}