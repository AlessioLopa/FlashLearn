<template>
  <div id="page">
    <div class="register-card">
      <h1 class="title">FlashLearn</h1>
      <h2 class="subtitle">Créer un nouveau compte</h2>

      <Form
        class="form"
        :resolver="resolver"
        :initialValues="registerData"
        @submit="onFormSubmit"
      >
        <FormField v-slot="$field" name="email" class="field">
          <label for="email">Email</label>
          <InputText id="email" name="email" type="email" fluid />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field?.error.message }}
          </Message>
        </FormField>

        <FormField v-slot="$field" name="password" class="field">
          <label for="password">Mot de passe</label>
          <InputText id="password" name="password" type="password" fluid />
          <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $field?.error.message }}
          </Message>
        </FormField>

        <Message
          v-if="registerError"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ registerError }}
        </Message>

        <Button
          class="submit-btn"
          type="submit"
          severity="secondary"
          label="Créer"
        />

        <router-link to="/login" class="login-link"> Se connecter </router-link>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Form } from "@primevue/forms";
import { FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import { register } from "@/services/auth";
import router from "@/router";

let registerData = ref({
  email: "",
  password: "",
});

let registerError = ref("");

const resolver = ref(
  zodResolver(
    z.object({
      email: z.string().email("Email invalide"),
      password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    }),
  ),
);

const onFormSubmit = async ({ valid, values }: any) => {
  if (valid) {
    try {
      if (await register(values.email, values.password)) {
        await router.push("/login");
      }
    } catch (error: any) {
      registerError.value = error.message;
      return;
    }
  }
};
</script>

<style scoped>
#page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
}

.register-card {
  width: 400px;
  padding: 2.5rem 2rem;
  border: 1px solid #000;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.title {
  margin: 0;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.95rem;
}

.submit-btn {
  width: 100%;
  margin-top: 0.5rem;
}

.login-link {
  text-align: center;
  font-size: 0.85rem;
  color: #333;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
