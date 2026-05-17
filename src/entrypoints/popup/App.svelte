<script lang="ts">
	import * as ToggleGroup from '@/lib/components/ui/toggle-group';
	import * as Card from '@/lib/components/ui/card';
	import { Label } from '@/lib/components/ui/label';
	import { Separator } from '@/lib/components/ui/separator';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import Package from '@lucide/svelte/icons/package';
	import Star from '@lucide/svelte/icons/star';

	type Mode = 'hide' | 'highlight' | 'disabled';

	let mode = $state<Mode>('hide');
	let highlightColor = $state('#fde047');
</script>

<main class="flex w-[340px] flex-col gap-4 p-4">
	<header class="flex flex-col gap-1">
		<h1 class="text-base leading-none font-semibold">Amazon Desponsor</h1>
		<p class="text-xs text-muted-foreground">Choose how to treat sponsored results.</p>
	</header>

	<div class="flex flex-col gap-2">
		<Label>Mode</Label>
		<ToggleGroup.Root type="single" variant="outline" bind:value={mode as never} class="w-full">
			<ToggleGroup.Item value="hide" class="flex-1">Hide</ToggleGroup.Item>
			<ToggleGroup.Item value="highlight" class="flex-1">Highlight</ToggleGroup.Item>
			<ToggleGroup.Item value="disabled" class="flex-1">Off</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	{#if mode === 'highlight'}
		<Separator />

		<div class="flex flex-col gap-2">
			<Label>Highlight color</Label>
			<label
				for="highlight-color"
				class="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-background px-3 py-2 transition-colors hover:bg-accent"
			>
				<span
					class="size-6 rounded-md border border-input shadow-sm"
					style="background-color: {highlightColor}"
				></span>
				<span class="font-mono text-sm uppercase">{highlightColor}</span>
				<input id="highlight-color" type="color" bind:value={highlightColor} class="sr-only" />
			</label>
		</div>
	{/if}

	<Separator />

	<div class="flex flex-col gap-2">
		<Label>Preview</Label>
		<Card.Root
			class={mode === 'hide' ? 'border-dashed' : ''}
			style={mode === 'highlight'
				? `background-color: ${highlightColor}33; border-color: ${highlightColor}`
				: ''}
		>
			<div class="flex items-start gap-3 px-6">
				<div class="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted">
					{#if mode === 'hide'}
						<EyeOff class="size-6 text-muted-foreground/60" />
					{:else}
						<Package class="size-8 text-muted-foreground/60" />
					{/if}
				</div>
				<div class="flex flex-1 flex-col">
					{#if mode === 'hide'}
						<Card.Title class="text-sm font-medium text-muted-foreground"
							>Sponsored results hidden</Card.Title
						>
						<Card.Description class="mt-1 text-xs"
							>Items marked Sponsored will not appear in search results.</Card.Description
						>
					{:else}
						<span class="text-[10px] leading-none font-medium tracking-wider text-muted-foreground"
							>SPONSORED</span
						>
						<Card.Title class="mt-1 line-clamp-2 text-sm leading-snug font-medium">
							Wireless Bluetooth Headphones with Active Noise Cancellation
						</Card.Title>
						<div class="mt-1 flex items-center gap-1.5">
							<div class="flex items-center">
								<Star class="size-3 fill-amber-400 stroke-amber-400" />
								<Star class="size-3 fill-amber-400 stroke-amber-400" />
								<Star class="size-3 fill-amber-400 stroke-amber-400" />
								<Star class="size-3 fill-amber-400 stroke-amber-400" />
								<Star class="size-3 stroke-amber-400/40" />
							</div>
							<span class="text-xs text-muted-foreground">(1,234)</span>
						</div>
						<div class="mt-1 flex items-start">
							<span class="pt-1 text-xs font-medium">$</span>
							<span class="text-2xl leading-none font-medium">19</span>
							<span class="pt-1 text-xs font-medium">99</span>
						</div>
					{/if}
				</div>
			</div>
		</Card.Root>
	</div>
</main>
