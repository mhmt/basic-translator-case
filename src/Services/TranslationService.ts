const translate = (textToTranslate: string, sourceLang: string = "en", targetLang: string = "tr") => {
    const serviceUrl = "https://translate.argosopentech.com/translate";
    return fetch(serviceUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            q: textToTranslate,
            source: sourceLang,
            target: targetLang,
        })
    }).then(res => res.json());

}

const TranslationService = {
    translate
}

export default TranslationService;