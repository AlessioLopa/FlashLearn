<template>
  <Dialog
    v-model:visible="props.visible"
    @update:visible="emit('update:visible', false)"
    modal
    header="Modifier la carte"
    :style="{ width: '25rem' }"
  >
    <Form
      :resolver="resolver"
      @submit="onUpdateCard"
      :initial-values="props.card"
      class="form"
    >
      <FormField v-slot="$field" name="recto" class="field">
        <label for="recto" class="font-semibold w-24">Recto</label>
        <InputText id="recto" class="flex-auto" autocomplete="off" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field?.error.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" name="verso" class="field">
        <label for="verso" class="font-semibold w-24">Verso</label>
        <InputText id="verso" class="flex-auto" autocomplete="off" />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $field?.error.message }}
        </Message>
      </FormField>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="emit('update:visible', false)"
        ></Button>
        <Button type="submit" label="Save"></Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import { FormField } from "@primevue/forms";
import Button from "primevue/button";
import Message from "primevue/message";

import { onMounted, ref } from "vue";
import z from "zod";
import { getCard, putCard } from "@/services/card";
import type { Card } from "@/interfaces/card";

const props = defineProps({
  visible: { type: Boolean, required: true },
  card: { type: Object as () => Card, required: true },
});

const emit = defineEmits(["update:visible"]);

const resolver = ref(
  zodResolver(
    z.object({
      recto: z.string().min(4, "Le recto ne peut pas être vide"),
      verso: z.string().min(4, "Le verso ne peut pas être vide"),
    }),
  ),
);

const onUpdateCard = async ({ valid, values }: any) => {
  if (valid) {
    try {
      await putCard(props.card.id, values.recto, values.verso);
      emit("update:visible", false);
    } catch (error: any) {
      alert(error.message);
    }
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
