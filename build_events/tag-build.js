const output =
`
module.exports = {
    commit_sha: '${process.env['CODEBUILD_RESOLVED_SOURCE_VERSION']}',
    build_id: '${process.env['CODEBUILD_BUILD_ID']}'
}
`
process.stdout.write(output);