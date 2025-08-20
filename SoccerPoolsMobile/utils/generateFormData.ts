import { UserEditableProps } from "types";

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
    return new File([blob], `logo_${Date.now()}.jpg`, { type: mime }); 
}

const createImageFile = (imageUrl: string) => {
    let imageFile;
    if (imageUrl.startsWith('data:image')) {
        // Web case - convert to Blob
        imageFile = convertToBlob(imageUrl);
    } else {
        // Mobile case - use URI as is
        imageFile = {
            uri: imageUrl,
            name: imageUrl.split('/').pop(),
            type: 'image/jpeg',
        };
    }

    return imageFile;
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
            const logoFile = createImageFile(logo);    
            // @ts-ignore
            formData.append('logo', logoFile);
        } 
    } else {
        formData.append('logo', null);
    }
    formData.append('name', name);
    formData.append('description', description);
    if (leagueId) {
        formData.append('league', String(leagueId));
    }

    return formData;
}

export const generateUserFormData = (userData: UserEditableProps, profileImage: string): FormData => {
    const formData: FormData = new FormData()
    if (profileImage){
        /* 
        If the logo is a URL, it means that it is an already created model which image has not
        been updated, so there is no need to append it to the form data
        */
        if (!profileImage.startsWith('https://')) {
            const profileFile = createImageFile(profileImage);            
            // @ts-ignore
            formData.append('profile_image', profileFile);  
        } 
    } else {
        formData.append('profile_image', null);
    }
    formData.append('name', userData.name.trim());
    formData.append('last_name', userData.last_name.trim());
    formData.append('username', userData.username.trim());
    formData.append('email', userData.email.trim());
    formData.append('instagram_username', userData.instagram_username.trim() || '');
    formData.append('twitter_username', userData.twitter_username.trim() || '');

    return formData;
}