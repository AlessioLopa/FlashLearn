import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Global messages applicable to all fields
  'required': 'Le champ {{ field }} est requis',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères',
  'email': 'Email invalide',
  'database.unique': 'Cet email est déjà utilisé',
  'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
  'maxLength': 'Le champ {{ field }} doit contenir au maximum {{ max }} caractères',
  // Field-specific messages override global messages
  'recto.required': 'Le recto ne peut pas être vide',
  'verso.required': 'Le verso ne peut pas être vide',
})
