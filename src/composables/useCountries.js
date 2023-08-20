
import { ref, onMounted, onBeforeMount } from "vue";

// by convention, composable function names start with "use"
export function useCountries() {
  // state encapsulated and managed by the composable
  const allCountries = ref([]);
  const allCca2Codes = ref([]);
  const optionsAnswers = ref([]);

  const targetCountry  = ref(null)


  const getAllCountries = async () => {
    try {
      const resp = await fetch("https://restcountries.com/v3.1/all");
      const data = await resp.json();
      allCountries.value = [...data.filter(({capital}) => capital)];
    } catch (error) {
      console.log("Error: esto explotó: ", error);
    }
  };

  const mapAllCca2 = () => { 
    allCca2Codes.value =  allCountries.value.map(({cca2}) => cca2)
  }

  const getRandomCca2 = () => { 
    const rndIndex = Math.floor( Math.random() * allCca2Codes.value.length)
    const randomCca2 = allCca2Codes.value[rndIndex];

    return randomCca2
  }


  const getCountryByCca2 = async(cca2) => { 
    let randomCountry;

    try {
      const resp = await fetch(`https://restcountries.com/v3.1/alpha?codes=${cca2}`)
      const data = await resp.json()
      randomCountry = { ...data }
    } catch (error) {
      console.error("Exploto esto: ", error)
      randomCountry = null
    }

    return randomCountry
  }

  const pickFourRandomCountries = () => { 
    let fourOptions = []

    while( fourOptions.length < 4 ) {
      const aRandomCca2 = getRandomCca2();
      if( !fourOptions.includes(aRandomCca2) ){
        fourOptions.push(aRandomCca2)
      }
    }
    
    return fourOptions
  }

  const getCountriesInfo = async([op1, op2, op3, op4]) => { 

    await Promise.all([
      await getCountryByCca2(op1),
      await getCountryByCca2(op2),
      await getCountryByCca2(op3),
      await getCountryByCca2(op4),
    ]).then((values) => {
      optionsAnswers.value = values.map((dataFromPromise) => dataFromPromise['0'] )
      
      const rndIndex = Math.floor( Math.random() * optionsAnswers.value.length)
      targetCountry.value = optionsAnswers.value[rndIndex]
    });
    
  }

  const generateNewOptions = async() => { 
    const fourRandomCountries = pickFourRandomCountries()
    await getCountriesInfo(fourRandomCountries)
  }

  onBeforeMount( async() => {
    await getAllCountries()
    mapAllCca2()

    await generateNewOptions()
  })


  // expose managed state as return value
  return { allCountries, optionsAnswers, targetCountry, generateNewOptions };
}
