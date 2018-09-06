const buildInfo = {
    commitSha: process.env['CODEBUILD_RESOLVED_SOURCE_VERSION'],
    buildId: process.env['CODEBUILD_BUILD_ID']
};

process.stdout.write(JSON.stringify(buildInfo, null, 2) + '\n');