/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Friend Link Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {import('mdast').RootContent[]} children - The child elements of the component.
 * @returns {import('mdast').Parent} The created Friend Link component.
 */
export function FriendCardComponent(_properties, children) {
	if (!Array.isArray(children) || children.length === 0)
		return h("div", { class: "hidden" }, ["Invalid or empty directive."]);

	const processedCards = children.map((child) => {
		if (child.type !== "element" && child.tagName !== "card")
			return h("div", { class: "hidden" }, ["Invalid card directive."]);

		const cardUuid = `FL${Math.random().toString(36).slice(-6)}`; // Collisions are not important

		const nAvatar = h(
			`div#${cardUuid}-avatar`,
			{
				class:
					"w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-900",
			},
			[
				h("img", {
					class: "w-full h-full object-cover",
					style: "margin: 0 !important;", // `m-0` will be replaced with other styles, causing problem
					src: child.properties.avatar,
					alt: child.properties.nick,
				}),
			],
		);

		const nTitle = h(
			"div",
			{
				class:
					"font-bold transition text-lg text-neutral-900 dark:text-neutral-100 mb-1",
			},
			child.properties.nick,
		);

		const nDescription = h(
			`div#${cardUuid}-description`,
			{
				class: "text-50 text-sm font-medium",
			},
			child.properties.description,
		);

		const nLink = h(
			`a#${cardUuid}-link`,
			{
				class:
					"btn-regular w-[3.25rem] rounded-lg bg-[var(--enter-btn-bg)] hover:bg-[var(--enter-btn-bg-hover)] active:bg-[var(--enter-btn-bg-active)] active:scale-95",
				style: "display: flex !important;",
				href: child.properties.link,
				target: "_blank",
				rel: "noopener noreferrer",
			},
			[
				h(
					"svg",
					{
						class:
							"transition text-[var(--primary)] text-4xl mx-auto iconify iconify--material-symbols",
						xmlns: "http://www.w3.org/2000/svg",
						"xmlns:xlink": "http://www.w3.org/1999/xlink",
						"aria-hidden": "true",
						role: "img",
						width: "1em",
						height: "1em",
						viewBox: "0 0 24 24",
					},
					[
						h("path", {
							fill: "currentColor",
							d: "M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z",
						}),
					],
				),
			],
		);

		return h(
			`div#${cardUuid}-card`,
			{
				class:
					"friend-card flex flex-nowrap items-stretch h-28 gap-4 rounded-[var(--radius-large)]",
			},
			[
				nAvatar,
				h("div", { class: "grow w-full" }, [nTitle, nDescription]),
				nLink,
			],
		);
	});

	return h(
		"div",
		{
			class: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 my-4",
		},
		processedCards,
	);
}
