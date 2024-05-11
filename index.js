const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.DUOLINGO_JWT}`,
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  }
  
  const { sub } = JSON.parse(
    Buffer.from(process.env.DUOLINGO_JWT.split('.')[1], 'base64').toString(),
  )
  
  async function sendRequest() {
      const { fromLanguage, learningLanguage, xpGains } = await fetch(
          `https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage,xpGains`,
          {
              headers,
          },
      ).then(response => response.json())
  
      const xpGainNotMath = xpGains.find(x => !!x.skillId && x.skillId.length > 30).skillId
      console.log('Current skillId for request: ', xpGainNotMath)
      const sessionRequest = {
          body: JSON.stringify({
              challengeTypes: [
                  'assist',
                  'characterIntro',
                  'characterMatch',
                  'characterPuzzle',
                  'characterSelect',
                  'characterTrace',
                  'completeReverseTranslation',
                  'definition',
                  'dialogue',
                  'form',
                  'freeResponse',
                  'gapFill',
                  'judge',
                  'listen',
                  'listenComplete',
                  'listenMatch',
                  'match',
                  'name',
                  'listenComprehension',
                  'listenIsolation',
                  'listenTap',
                  'partialListen',
                  'partialReverseTranslate',
                  'readComprehension',
                  'select',
                  'selectPronunciation',
                  'selectTranscription',
                  'syllableTap',
                  'syllableListenTap',
                  'speak',
                  'tapCloze',
                  'tapClozeTable',
                  'tapComplete',
                  'tapCompleteTable',
                  'tapDescribe',
                  'translate',
                  'typeCloze',
                  'typeClozeTable',
                  'typeCompleteTable',
              ],
              fromLanguage,
              isFinalLevel: false,
              isV2: true,
              juicy: true,
              learningLanguage,
              skillId: xpGainNotMath,
              smartTipsVersion: 2,
              type: 'SPEAKING_PRACTICE',
          }),
          headers,
          method: 'POST',
      }
      const session = await fetch('https://www.duolingo.com/2017-06-30/sessions', sessionRequest).then(response => response.json())
      
      const responseRequest = {
          body: JSON.stringify({
              ...session,
              heartsLeft: 0,
              startTime: (+new Date() - 60000) / 1000,
              enableBonusPoints: false,
              endTime: +new Date() / 1000,
              failed: false,
              maxInLessonStreak: 9,
              shouldLearnThings: true,
          }),
          headers,
          method: 'PUT',
      };
      const response = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, responseRequest).then(response => response.json())
  
      console.log(`Request done, gained xp: ${response.xpGain}`)
      
  }
  
  const timer = ms => new Promise(res => setTimeout(res, ms))
  
  function randomIntFromInterval(min, max) { // min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  async function main () { // We need to wrap the loop into an async function for this to work
    for (var i = 1; i < 150; i++) {
      await sendRequest();
      const time = 60000 + randomIntFromInterval(20, 60) * 1000 + randomIntFromInterval(1, 999);
      console.log(`END OF ITERATION #${i}, current time: ${new Date().toLocaleString().replace(',','')}, going to sleep for ${time/1000} seconds`);
      await timer(time); // then the created Promise can be awaited
      //if (i % 10 === 0) {
      //    const bigDelay = 1000 * 60 * randomIntFromInterval(30, 50)
      //    console.log('------')
      //    console.log(`IT IS TIME FOR BIG DELAY, additional sleep for ${bigDelay/60000} minutes`)
      //    await timer(bigDelay)
      //}
      console.log('----------------------------------------------------------------------------------')
    }
  }
  console.log('1')
  
  main();