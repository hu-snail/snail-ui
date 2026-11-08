<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SnForm, type FormRules } from '@snui/vue-web';
import { useAuthStore } from '@/stores/auth';
import { describeError } from '@/request/http';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// Imperative handle only — the template usage itself is auto-imported.
type FormInstance = InstanceType<typeof SnForm>;
const formRef = ref<FormInstance | null>(null);

const model = reactive({ username: '', password: '' });
const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('validation.usernameRequired') }],
  password: [{ required: true, message: t('validation.passwordRequired') }],
}));

const submitting = ref(false);
const errorMessage = ref('');

const redirectPath = computed(() => {
  const raw = route.query.redirect;
  return typeof raw === 'string' && raw.startsWith('/') ? raw : '/home';
});

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';
  const form = formRef.value;
  if (form === null || !(await form.validate())) return;
  submitting.value = true;
  try {
    await authStore.login({ ...model });
    await router.push(redirectPath.value);
  } catch (error) {
    errorMessage.value = describeError(error, t);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__brand">
        <span class="auth-card__logo" aria-hidden="true">S</span>
        <span class="auth-card__name">{{ t('app.title') }}</span>
      </div>
      <h1 class="auth-card__title">{{ t('login.title') }}</h1>
      <p class="auth-card__subtitle">{{ t('login.subtitle') }}</p>

      <SnAlert
        v-if="errorMessage !== ''"
        type="error"
        :title="errorMessage"
        class="auth-card__alert"
      />

      <SnForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <SnFormItem :label="t('common.username')" prop="username">
          <SnInput v-model="model.username" :placeholder="t('common.username')" clearable />
        </SnFormItem>
        <SnFormItem :label="t('common.password')" prop="password">
          <SnInput
            v-model="model.password"
            type="password"
            show-password
            :placeholder="t('common.password')"
            clearable
            @keydown.enter="handleSubmit"
          />
        </SnFormItem>
        <SnButton
          class="auth-card__submit"
          type="primary"
          block
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ t('common.login') }}
        </SnButton>
      </SnForm>

      <p class="auth-card__hint">{{ t('login.demoHint') }}</p>
      <RouterLink class="auth-card__switch" to="/register">{{
        t('register.toRegister')
      }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background:
    radial-gradient(
      1200px 600px at 20% -10%,
      var(--sn-web-color-action-primary-soft),
      transparent 60%
    ),
    var(--sn-web-color-background-surface);
}

.auth-card {
  width: 360px;
  padding: var(--sn-web-spacing-8);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-md);
}

.auth-card__brand {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin-bottom: var(--sn-web-spacing-6);
}

.auth-card__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-weight: var(--sn-web-font-weight-bold);
}

.auth-card__name {
  font-size: var(--sn-web-font-size-lg);
  font-weight: var(--sn-web-font-weight-semibold);
}

.auth-card__title {
  margin: 0;
  font-size: var(--sn-web-font-size-xl);
}

.auth-card__subtitle {
  margin: var(--sn-web-spacing-1) 0 var(--sn-web-spacing-6);
  color: var(--sn-web-color-text-tertiary);
}

.auth-card__alert {
  margin-bottom: var(--sn-web-spacing-4);
}

.auth-card__submit {
  margin-top: var(--sn-web-spacing-2);
}

.auth-card__hint {
  margin: var(--sn-web-spacing-4) 0 0;
  font-size: var(--sn-web-font-size-sm);
  color: var(--sn-web-color-text-tertiary);
}

.auth-card__switch {
  display: inline-block;
  margin-top: var(--sn-web-spacing-2);
  font-size: var(--sn-web-font-size-sm);
}
</style>
