<template>
  <div id="page">
    <div class="login-card">
      <h1 class="title">FlashLearn</h1>

      <Form
        class="form"
        :resolver="resolver"
        :initialValues="loginData"
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
          v-if="loginError"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ loginError }}
        </Message>

        <Button
          class="submit-btn"
          type="submit"
          severity="secondary"
          label="Se connecter"
        />

        <router-link to="/register" class="register-link">
          Créer un compte
        </router-link>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { email, z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Form } from "@primevue/forms";
import { FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import { login } from "@/services/auth";
import router from "@/router";

let loginData = ref({
  email: "",
  password: "",
});

let loginError = ref("");

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
      if (await login(values.email, values.password)) {
        if (localStorage.getItem("access_token")) {
          await router.push("/home");
        }
      }
    } catch (error: any) {
      loginError.value = error.message;
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

.login-card {
  width: 400px;
  padding: 2.5rem 2rem;
  border: 1px solid #000;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  margin: 0;
  text-align: center;
  font-size: 2.5rem;
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

.register-link {
  text-align: center;
  font-size: 0.85rem;
  color: #333;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
