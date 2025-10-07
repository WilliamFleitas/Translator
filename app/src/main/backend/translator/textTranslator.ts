const textTranslator = async (
  text: string,
  from: string,
  to: string,
  subsKey: string | undefined,
  region: string | undefined
): Promise<string> => {
  const detectLanguageEndpoint = `https://api.cognitive.microsofttranslator.com/detect?api-version=3.0`
  if (!subsKey || !region) {
    throw Error('Azure API Key or Region are missing')
  }

  try {
    let detectedLanguage = from
    if (from === 'detect_language') {
      const detectResponse = await fetch(detectLanguageEndpoint, {
        method: 'POST',
        body: JSON.stringify([{ Text: text }]),
        headers: {
          'Ocp-Apim-Subscription-Key': subsKey,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json'
        }
      })
      const detectData = await detectResponse.json()
      if (detectResponse.status === 200 && detectData[0]?.language) {
        detectedLanguage = detectData[0].language
      } else {
        if (detectResponse.status === 401 && detectResponse.statusText) {
          throw new Error(`API Key error: ${detectResponse.statusText}`)
        } else {
          throw new Error(`Error: ${detectResponse.statusText ?? 'Error detecting language'}`)
        }
      }
    }
    const translationEndpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`
    const response = await fetch(`${translationEndpoint}&from=${detectedLanguage}&to=${to}`, {
      method: 'POST',
      body: JSON.stringify([{ text }]),
      headers: {
        'Ocp-Apim-Subscription-Key': subsKey,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (response.status === 200) {
      return data[0]?.translations[0]?.text
    } else {
      throw Error(data.error.message)
    }
  } catch (error: any) {
    throw Error(error.message)
  }
}

export default textTranslator
