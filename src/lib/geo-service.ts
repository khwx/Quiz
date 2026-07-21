import { GEO_SERVICE_URL } from "@/lib/constants";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("geo-service");

export async function getCountryCode() {
    try {
        const response = await fetch(GEO_SERVICE_URL);
        const data = await response.json();
        return data.country_code || 'PT';
    } catch (error) {
        log.error("Erro ao obter geolocalização", { error: String(error) });
        return 'PT';
    }
}

export function filterQuestions(questions: any[], country: string, age: number) {
    return questions.filter(q =>
        q.country_code === country &&
        (age === 18 ? q.age_rating === 18 : q.age_rating <= age)
    );
}
