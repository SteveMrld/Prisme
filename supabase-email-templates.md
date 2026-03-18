# Templates email Supabase — à configurer manuellement
# Supabase → Authentication → Email Templates

## Confirmation d'inscription (Confirm signup)
Sujet : Confirmez votre adresse email — Prisme

```html
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#FAFAF8;color:#0A0A0A">
  <div style="font-size:28px;font-weight:700;letter-spacing:-1px;margin-bottom:32px">
    Pris<em style="font-style:italic;font-weight:300">me</em>
  </div>
  <h1 style="font-size:24px;font-weight:400;margin-bottom:16px;letter-spacing:-0.5px">
    Confirmez votre adresse email
  </h1>
  <p style="font-size:17px;font-style:italic;color:#6A6A6A;line-height:1.65;margin-bottom:32px">
    Cliquez sur le bouton ci-dessous pour activer votre compte Prisme.
  </p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">
    Confirmer mon email →
  </a>
  <p style="font-size:13px;color:#9A9590;margin-top:32px;line-height:1.55">
    Si vous n'avez pas créé de compte Prisme, ignorez cet email.
  </p>
  <div style="border-top:1px solid #D8D3C8;margin-top:40px;padding-top:16px;font-size:11px;color:#9A9590;letter-spacing:1px;text-transform:uppercase">
    Prisme · Média d'analyse indépendant
  </div>
</div>
```

## Lien magique (Magic Link)
Sujet : Votre lien de connexion — Prisme

```html
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#FAFAF8;color:#0A0A0A">
  <div style="font-size:28px;font-weight:700;letter-spacing:-1px;margin-bottom:32px">
    Pris<em style="font-style:italic;font-weight:300">me</em>
  </div>
  <h1 style="font-size:24px;font-weight:400;margin-bottom:16px;letter-spacing:-0.5px">
    Votre lien de connexion
  </h1>
  <p style="font-size:17px;font-style:italic;color:#6A6A6A;line-height:1.65;margin-bottom:32px">
    Cliquez ci-dessous pour vous connecter. Ce lien est valable 1 heure.
  </p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">
    Me connecter →
  </a>
  <p style="font-size:13px;color:#9A9590;margin-top:32px;line-height:1.55">
    Si vous n'avez pas demandé ce lien, ignorez cet email.
  </p>
  <div style="border-top:1px solid #D8D3C8;margin-top:40px;padding-top:16px;font-size:11px;color:#9A9590;letter-spacing:1px;text-transform:uppercase">
    Prisme · Média d'analyse indépendant
  </div>
</div>
```

## Réinitialisation mot de passe (Reset Password)
Sujet : Réinitialisez votre mot de passe — Prisme

```html
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#FAFAF8;color:#0A0A0A">
  <div style="font-size:28px;font-weight:700;letter-spacing:-1px;margin-bottom:32px">
    Pris<em style="font-style:italic;font-weight:300">me</em>
  </div>
  <h1 style="font-size:24px;font-weight:400;margin-bottom:16px;letter-spacing:-0.5px">
    Réinitialisez votre mot de passe
  </h1>
  <p style="font-size:17px;font-style:italic;color:#6A6A6A;line-height:1.65;margin-bottom:32px">
    Cliquez ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable 1 heure.
  </p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:14px 32px;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">
    Choisir un nouveau mot de passe →
  </a>
  <p style="font-size:13px;color:#9A9590;margin-top:32px;line-height:1.55">
    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
  </p>
  <div style="border-top:1px solid #D8D3C8;margin-top:40px;padding-top:16px;font-size:11px;color:#9A9590;letter-spacing:1px;text-transform:uppercase">
    Prisme · Média d'analyse indépendant
  </div>
</div>
```
