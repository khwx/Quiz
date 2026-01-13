export async function getCountryCode() {
    try {
        // Usando um serviço gratuito de IP Geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.country_code || 'PT'; // PT por defeito
    } catch (error) {
        console.error("Erro ao obter geolocalização:", error);
        return 'PT';
    }
}

export function filterQuestions(questions: any[], country: string, age: number) {
    return questions.filter(q =>
        q.country_code === country &&
        (age === 18 ? q.age_rating === 18 : q.age_rating <= age)
    );
}
