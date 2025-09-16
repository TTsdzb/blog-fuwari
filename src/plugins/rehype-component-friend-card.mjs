/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Friend Link Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.nick - The displayed nickname of friend.
 * @param {string} properties.avatar - The displayed avatar of friend.
 * @param {string} properties.description - The description of the website.
 * @param {string} properties.link - The link of the website.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function FriendCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, ["Invalid directive."]);

	const cardUuid = `FL${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	const nAvatar = h(`div#${cardUuid}-avatar`, {
		class: "gc-avatar",
		style: {
			"background-image": "url(" + properties.avatar + ")",
			"background-color": "transparent",
			width: "5em",
			height: "5em",
			"border-radius": "0.3em",
			"margin-right": "1em",
		},
	});

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h(
					"div",
					{
						class: "gc-repo",
						style: { "font-size": "1.5em" },
					},
					properties.nick
				),
			]),
		]),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{
			class: "gc-description",
			style: {
				"margin-top": "1em",
				"margin-bottom": "0",
			},
		},
		properties.description
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-github no-styling",
			href: properties.link,
			target: "_blank",
		},
		[nTitle, nDescription]
	);
}
