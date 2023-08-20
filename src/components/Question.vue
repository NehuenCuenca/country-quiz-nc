<template>
    <div class="question" v-if="1 === displayQuestionNumber">{{ firstCapital }} is the capital of</div>
    <div class="question" v-else>
        <img :src="flagLinkSvg" alt="Unknow flag">
        This flag stands for ...
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
    props: ["targetCountry"],
    setup(props) {

        const displayByRandomNumber = () => Math.floor(Math.random() * 2)
        const displayQuestionNumber = ref(displayByRandomNumber())

        const flagLinkSvg = computed(() => {
            return props.targetCountry.flags.svg
        })
        const firstCapital = computed(() => {
            return props.targetCountry.capital[0]
        })

        watch(() => props.targetCountry.cca2, () => {
            displayQuestionNumber.value = displayByRandomNumber()
        });

        return { displayQuestionNumber, firstCapital, flagLinkSvg }
    }
}
</script>

<style scoped>
.question {
    margin-top: 12%;
    font: 700 1.5rem "Poppins", sans-serif;
    color: #2F527B;
    display: grid;
    place-items: end start;
    gap: 2vh 0;
}

.question img {
    width: 84px;
    height: 54px;
    border-radius: 4px;
}
</style>