<template>
  <div id="page">
    <div id="review-page">
      <div class="review-container" v-if="reviewing === true">
        <div class="header">
          <router-link to="/home" class="register-link"> < Retour </router-link>
          <h1>Moment révision !</h1>
          <div class="progress-bar">
            <ProgressBar
              :value="((index + 1) * 100) / cardLength"
              :showValue="false"
              style="width: 200px; height: 12px"
            ></ProgressBar>
            <p>{{ index + 1 }} / {{ cardLength }}</p>
          </div>
        </div>
        <div class="card-section">
          <div class="flip-card" @click="cardFliped = true">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <h1>{{ cardToReview?.recto }}</h1>
              </div>
              <div class="flip-card-back">
                <h1>{{ cardToReview?.verso }}</h1>
              </div>
            </div>
          </div>
          <div class="answer" :class="{ 'answer-hidden': !cardFliped }">
            <Button
              class="answer-btn"
              icon="pi pi-times"
              severity="danger"
              @click="onAnswer(false)"
            ></Button>
            <Button
              class="answer-btn"
              icon="pi pi-check"
              severity="success"
              @click="onAnswer(true)"
            ></Button>
          </div>
        </div>
      </div>
      <EndReview
        :message="'Session de révision terminée'"
        v-if="reviewing === false && noCardToReview === false"
      ></EndReview>

      <EndReview
        :message="`Pas de cartes à réviser pour l'instant`"
        v-if="reviewing === false && noCardToReview === true"
      ></EndReview>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from "@/interfaces/card";
import { answerReview, getCardsForReview } from "@/services/review";
import { Button } from "primevue";
import { onMounted, reactive, ref } from "vue";
import ProgressBar from "primevue/progressbar";
import EndReview from "@/components/endReview.vue";

const cards = ref<Card[]>([]);

const cardToReview = ref<Card>();

const cardLength = ref();

const index = ref(0);

const reviewing = ref(true);
const noCardToReview = ref(false);

const cardFliped = ref(false);

onMounted(async () => {
  try {
    cards.value = await getCardsForReview();
    cardLength.value = cards.value.length;

    cardToReview.value = cards.value[index.value];
  } catch (error: any) {
    if (error.code === "NO_CARDS_TO_REVIEW") {
      noCardToReview.value = true;
      reviewing.value = false;
      return;
    } else {
      alert(error.message);
    }
  }
});

const onAnswer = async (success: boolean) => {
  if (index.value < cardLength.value - 1) {
    index.value += 1;
    cardFliped.value = false;
  } else {
    index.value = 0;
    reviewing.value = false;
  }

  try {
    await answerReview(cardToReview.value!.id, success);
    cardToReview.value = cards.value[index.value];
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<style scoped>
#page {
  background-color: #f5f5f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.flip-card {
  background-color: transparent;
  width: 400px;
  height: 400px;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background-color: white;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.answer {
  display: flex;
  gap: 2rem;
}

.answer-hidden {
  visibility: hidden;
}

.answer-btn {
  width: 100px;
  height: 50px;
  font-size: 1.2rem;
}

#review-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  height: 100vh;
  width: 60%;
}

.review-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  flex: 1;
}

.card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-top: 3rem;
}

.header h1 {
  font-size: 3rem;
}

.register-link {
  top: 1rem;
  left: 1rem;
  font-size: 0.85rem;
  color: #333;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.return-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.endReview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
