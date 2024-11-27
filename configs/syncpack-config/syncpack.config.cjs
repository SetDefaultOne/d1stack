/**
 * Syncpack configuration.
 * @see https://jamiemason.github.io/syncpack/config/syncpackrc/
 * @type {import("syncpack").RcFile}
 */
const config = {
    indent: "    ",
    semverGroups: [
        {
            range: "",
            packages: ["**"],
            dependencies: ["**"],
            label: "the version of npm dependencies must always be exact",
        },
    ],
    versionGroups: [
        {
            dependencies: ["@types/**"],
            dependencyTypes: ["!dev"],
            label: "the @types/* dependencies must always be dev dependencies",
            isBanned: true,
        },
        {
            packages: ["**"],
            dependencies: ["@d1stack/**"],
            specifierTypes: ["latest"],
            label: "the version of local dependencies must always be latest",
        },
    ],
    source: ["package.json", "**/package.json", "!node_modules/"],
};

module.exports = config;
