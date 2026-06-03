<template>
  <div id="page">
    <div class="content">
      <div class="welcome">
        <h1 class="title">Bienvenue ! 👋</h1>
        <Button
          class="logout-btn"
          icon="pi pi-sign-out"
          severity="secondary"
          @click="logoutSelected"
        />
      </div>
      <div class="info">
        <h1 id="total-card">{{ totalCards }}</h1>
        <div class="boxes-container">
          <div class="segmented-bar">
            <div
              v-for="i in 5"
              :key="i"
              :style="{ flexGrow: totalCardsByBox[i] }"
              class="segment"
            ></div>
          </div>
          <div class="boxes-cards">
            <h1 v-for="i in 5" :key="i" class="box-card">
              {{ totalCardsByBox[i] }}
            </h1>
          </div>
        </div>
      </div>
      <div class="fast-action">
        <h1>Action rapide</h1>
        <div class="action">
          <Button
            class="btn"
            label="Commencer révision"
            severity="secondary"
            @click="startReview"
          ></Button>
          <Button
            class="btn"
            icon="pi pi-plus"
            severity="secondary"
            @click="newCardDialogVisible = true"
            name="create-card"
          ></Button>
        </div>
      </div>
      <div class="cards-list">
        <h1>Cartes</h1>
        <DataTable :value="cards" scrollable class="cards-datatable">
          <Column style="width: auto" field="recto" header="Recto"></Column>
          <Column style="width: auto" field="verso" header="Verso"></Column>
          <Column style="width: auto" field="box" header="Boîte"></Column>
          <Column
            style="width: auto"
            field="next_review_at"
            header="Prochaine révision"
          >
            <template #body="slotProps">
              <p v-if="slotProps.data.nextReviewAt">
                {{
                  new Date(slotProps.data.nextReviewAt).toLocaleString("fr-FR")
                }}
              </p>
              <p v-else>Pas encore révisé</p>
            </template>
          </Column>
          <Column style="width: 4rem">
            <template #body="{ data }">
              <Button
                icon="pi pi-trash"
                @click="deleteCardSelected(data)"
                severity="secondary"
                rounded
              ></Button>
            </template>
          </Column>
          <Column style="width: 4rem">
            <template #body="{ data }">
              <Button
                icon="pi pi-pencil"
                @click="updateCard(data)"
                severity="secondary"
                rounded
              ></Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
  <NewCardDialog
    v-model:visible="newCardDialogVisible"
    @update:visible="
      newCardDialogVisible = false;
      fetchCards();
    "
  />
  <EditCardDialog
    v-model:visible="editCardDialogVisible"
    :card="selectedCardForUpdate"
    @update:visible="
      editCardDialogVisible = false;
      fetchCards();
    "
  ></EditCardDialog>
</template>

<script setup lang="ts">
import router from "@/router";
import { logout } from "@/services/auth";
import { deleteCard, getCards } from "@/services/card";
import { Button, DataTable, Column, ProgressBar } from "primevue";
import { onMounted, ref } from "vue";
import type { Card } from "@/interfaces/card";
import NewCardDialog from "@/components/newCardDialog.vue";
import EditCardDialog from "@/components/editCardDialog.vue";

const cards = ref([]);
const totalCards = ref(0);
const totalCardsByBox = ref<{ [key: number]: number }>({
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
});

const newCardDialogVisible = ref(false);
const editCardDialogVisible = ref(false);

const selectedCardForUpdate = ref<Card>({
  id: 0,
  recto: "",
  verso: "",
  next_review_at: null,
  box: 1,
});

const fetchCards = async () => {
  cards.value = await getCards().catch((error: any) => {
    alert(error.message);
  });

  console.log(cards.value);

  totalCards.value = cards.value.length;

  totalCardsByBox.value[1] = cards.value.filter(
    (card: any) => card.box === 1,
  ).length;
  totalCardsByBox.value[2] = cards.value.filter(
    (card: any) => card.box === 2,
  ).length;
  totalCardsByBox.value[3] = cards.value.filter(
    (card: any) => card.box === 3,
  ).length;
  totalCardsByBox.value[4] = cards.value.filter(
    (card: any) => card.box === 4,
  ).length;
  totalCardsByBox.value[5] = cards.value.filter(
    (card: any) => card.box === 5,
  ).length;
};

onMounted(async () => {
  await fetchCards();
});

const logoutSelected = async () => {
  try {
    if (await logout()) {
      router.push("/login");
    }
  } catch (error: any) {
    alert(error.message);
  }
};

const deleteCardSelected = async (data: Card) => {
  try {
    await deleteCard(data.id);
    await fetchCards();
  } catch (error: any) {
    alert(error.message);
  }
};

const updateCard = (data: any) => {
  editCardDialogVisible.value = true;
  selectedCardForUpdate.value = data;
};

const startReview = async () => {
  router.push("/review");
};
</script>

<style scoped>
#page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  margin: 0;
  padding: 2rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  width: 60%;
}

.welcome {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title {
  text-align: left;
  font-size: 2.5rem;
}

.logout-btn {
  margin-left: auto;
}

.info {
  display: flex;
  gap: 2rem;

  margin-bottom: 2rem;
}

.boxes-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.boxes-cards {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
}

.box-card {
  width: fit-content;

  border: 1px solid black;
  border-radius: 12px;
  padding: 1rem;
}

#total-card {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  width: fit-content;
  border: 1px solid black;
  border-radius: 12px;
  padding: 1rem;
}

.action {
  display: flex;
  gap: 1rem;
}

.btn {
  border: 1px solid black;
}

.cards-list {
  margin-bottom: 2rem;
}

.segmented-bar {
  display: flex;
  width: 100%;
  height: 1rem;
  border-radius: 12px;
  background-color: #e5e5e5;
  gap: 2px;
}

.segment:nth-child(1) {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;

  background: #ef4444;
}
.segment:nth-child(2) {
  background: #f97316;
}
.segment:nth-child(3) {
  background: #eab308;
}
.segment:nth-child(4) {
  background: #84cc16;
}
.segment:nth-child(5) {
  background: #22c55e;
}
</style>
