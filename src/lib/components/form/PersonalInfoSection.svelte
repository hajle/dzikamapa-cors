<script lang="ts">
	import FormInput from './FormInput.svelte';

	// Props with proper typing
	let {
		firstName = $bindable(''),
		lastName = $bindable(''),
		email = $bindable(''),
		phone = $bindable(''),
		errors = {},
		onPhoneInput = undefined
	}: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		errors: Record<string, string>;
		onPhoneInput?: ((e: Event) => void) | undefined;
	} = $props();
</script>

<!-- Personal Information Form -->
<div class="mt-3.5 px-5">
	<div class="space-y-2.5 md:grid md:grid-cols-2 md:gap-2.5">
		<!-- First Name -->
		<FormInput
			bind:value={firstName}
			placeholder="Imię*"
			id="name"
			type="text"
			error={errors.firstName}
			required={true}
			className="payu-name"
		/>

		<!-- Last Name -->
		<FormInput
			bind:value={lastName}
			placeholder="Nazwisko*"
			id="surname"
			type="text"
			error={errors.lastName}
			required={true}
			className="payu-surname"
		/>

		<!-- Email -->
		<FormInput
			bind:value={email}
			placeholder="Email*"
			id="email"
			type="email"
			error={errors.email}
			required={true}
			className="payu-email"
		/>

		<!-- Phone -->
		<FormInput
			bind:value={phone}
			placeholder="Telefon*"
			id="phone"
			type="tel"
			error={errors.phone}
			required={true}
			oninput={onPhoneInput}
			className="payu-phone"
		/>
	</div>
</div>
