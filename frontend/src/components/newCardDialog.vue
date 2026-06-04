<template>
  <Dialog
    v-model:visible="props.visible"
    @update:visible="emit('update:visible', false)"
    modal
    header="Nouvelle carte"
    :style="{ width: '25rem' }"
  >
    <Form
      :resolver="resolver"
      @submit="onCreateNewCard"
      :initial-values="data"
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

import { ref } from "vue";
import z from "zod";
import { postCard } from "@/services/card";

const props = defineProps({
  visible: { type: Boolean, required: true },
});

const data = ref({
  recto: "",
  verso: "",
});

const emit = defineEmits(["update:visible"]);

const resolver = ref(
  zodResolver(
    z.object({
      recto: z
        .string()
        .min(1, "Le recto ne peut pas être vide")
        .max(255, "Le recto ne peut pas dépasser 255 caractères"),
      verso: z
        .string()
        .min(1, "Le verso ne peut pas être vide")
        .max(255, "Le verso ne peut pas dépasser 255 caractères"),
    }),
  ),
);

const onCreateNewCard = async ({ valid, values }: any) => {
  if (valid) {
    try {
      await postCard(values.recto, values.verso);
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
