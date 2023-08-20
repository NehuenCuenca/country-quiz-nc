<template>
  <main>
    <div class="window">
      <div class="upper-section-window">
        <span class="title">Country quiz</span>
        <img class="world-logo" src="/undraw_adventure_4hum 1.svg" v-show="isPlaying">
      </div>

      <template v-if="targetCountry && isPlaying">
        <Question :targetCountry="targetCountry"/>

        <ul class="answers-options-list">
          <li class="answer-option-item" ref="optionsAnswersElements" :data-cca2="option.cca2"
            @click="checkClickedOption(option, indexOption)" v-for="(option, indexOption) in optionsAnswers"
            :key="indexOption">
            {{ option.name.common }}
          </li>
        </ul>

        <button class="next-question" v-if="isPlaying && selectedOptionWasCorrect" @click="continueWithNexQuestion">Next
        </button>
      </template>

      <template v-if="!selectedOptionWasCorrect && !isPlaying">
        <img src="/undraw_winners_ao2o 2.svg" alt="Your record" class="trophy-svg">
        <span class="title">Results</span>
        <p>You got <span class="corrects-answers">{{ correctAnswers }}</span> correct answers</p>
        <button class="try-again" @click="startNewGame">Try again</button>
      </template>
    </div>
  </main>

  <footer>created by Nehuen - devChallenges.io</footer>
</template>

<script>

import Question from './components/Question.vue'
import { computed, onMounted, ref } from "vue";
import { useCountries } from "./composables/useCountries"

export default {
  components: { Question, },
  setup() {
    const isPlaying = ref(true);
    const selectedOptionWasCorrect = ref(false);
    const correctAnswers = ref(0);
    const displayQuestionNumber = ref( Math.floor( Math.random() * 2) + 1 )
    const optionsAnswersElements = ref([])

    const { allCountries, optionsAnswers, targetCountry, generateNewOptions } = useCountries()


    const checkClickedOption = (option, indexOption) => {
      const { cca2 } = targetCountry.value
      const selectedOptionIsCorrect = option.cca2 === cca2

      const someOptionHasBeenSelected = optionsAnswersElements.value.some(option => {
        const cl = option.classList
        if (cl.contains('correct') || cl.contains('incorrect')) { return true }
      })
      if (someOptionHasBeenSelected) return

      if (selectedOptionIsCorrect) {
        optionsAnswersElements.value[indexOption].classList.add('correct')
        correctAnswers.value++
        selectedOptionWasCorrect.value = true
        return
      }

      setTimeout(() => { isPlaying.value = false }, 2500);
      selectedOptionWasCorrect.value = false

      const correctOptionElement = optionsAnswersElements.value.find(optionElement => optionElement.getAttribute('data-cca2') === cca2);
      correctOptionElement?.classList.add('correct')
      optionsAnswersElements.value[indexOption].classList.add('incorrect')
    }

    const cleanClassListForEachOption = () => {
      optionsAnswersElements.value.forEach(optionElement => optionElement.setAttribute("class", "answer-option-item"))
    }

    const continueWithNexQuestion = () => {
      cleanClassListForEachOption()
      selectedOptionWasCorrect.value = false
      generateNewOptions();
    }

    const startNewGame = () => {
      cleanClassListForEachOption()
      selectedOptionWasCorrect.value = false
      isPlaying.value = true
      correctAnswers.value = 0;
      generateNewOptions();
    }

    const capitalNameCountry = computed(() => {
      const capitalName = targetCountry.value.capital[0] || ''
      return `${capitalName} is the capital of`
    })


    return {
      displayQuestionNumber,
      allCountries,
      optionsAnswers,
      targetCountry,
      checkClickedOption,
      optionsAnswersElements,
      isPlaying,
      selectedOptionWasCorrect,
      correctAnswers,
      continueWithNexQuestion,
      capitalNameCountry,
      startNewGame,
    };
  },
};
</script>

<style scoped>
.window {
  background-color: white;
  padding: 2vh 2vw;
  width: 40vw;
  min-height: 60vh;
  max-height: 80vh;
  height: 75vh;
  border-radius: 24px;
  display: grid;
  grid-template-columns: 100%;
  grid-auto-rows: 20vh auto 5vh;
  gap: 4vh 0;
  position: relative;
}


.upper-section-window {
  /* height: 20vh; */
  position: absolute;
  bottom: 100%;
  width: 90%;
  justify-self: center;
}


.upper-section-window .title {
  bottom: 15%;
  position: relative;
  color: #f2f2f2;
  font: 700 2.25rem "Poppins", sans-serif;
  white-space: nowrap;
}

img.world-logo {
  position: absolute;
  left: 60%;
  top: -20%;
}



ul.answers-options-list {
  height: 35vh;
  margin-top: 2%;
  position: relative;
  display: flex;
  flex-direction: column;
  list-style-type: upper-alpha;
  list-style-position: inside;
  justify-content: space-between;
}

li.answer-option-item {
  padding: 10px;
  border: 2px solid #6066D0B2;
  border-radius: 12px;
  font: 500 1.125rem "Poppins", sans-serif;
  color: #6066D0CC;
  transition: all .2s ease;
  cursor: pointer;
}

.answer-option-item:hover {
  background-color: #F9A826;
  color: white;
  border-color: transparent;
}


.answer-option-item:is(.correct, .incorrect) {
  color: #FFFF;
}

.answer-option-item.correct {
  background-color: #60BF88;
}

.answer-option-item.incorrect {
  background-color: #EA8282;
}

button.next-question {
  font: 700 1.125rem 'Poppins', sans-serif;
  color: #FFFF;
  background-color: #F9A826;
  box-shadow: 0px 2px 4px 0px #FCA82F66;
  border-radius: 12px;
  width: 116px;
  height: 56px;
  position: relative;
  bottom: 50%;
  left: 70%;
}


.trophy-svg {
  position: relative;
  top: 10%;
  place-self: center;
}

.title {
  color: #1D355D;
  font: 700 3rem 'Poppins', sans-serif;
  place-self: center;
  width: fit-content;
  height: fit-content;
}

p {
  color: #1D355D;
  font: 400 1.125rem 'Poppins', sans-serif;
  text-align: center;
}

p .corrects-answers {
  color: #6FCF97;
  font: 700 2.5rem 'Poppins', sans-serif;

}

.try-again {
  border: 2px solid #1D355D;
  border-radius: 5px;
  width: fit-content;
  height: fit-content;
  padding: .5rem;
  background-color: #FFFF;
  place-self: center;
  color: #1D355D;
  font: 600 1.125rem 'Poppins', sans-serif
}
</style>