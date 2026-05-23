import { pool } from "../../../db";

const issueIntoDB =async(
    payload:{
        title:string;
        description:string;
        type: 'bug'|"feature_request"
    },
    reporterId:number
)=>{
    const{title,description,type}=payload;

    const result =await pool.query(
            `
    INSERT INTO issues
    (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporterId]
    );
    return result.rows[0];
};

const getIssuesDB = async (
  query: any
) => {
  const {
    sort = "newest",
    type,
    status,
  } = query;

  let sql = `SELECT * FROM issues`;
  const conditions = [];
  const values = [];

  
  if (type) {
    values.push(type);
    conditions.push(
      `type = $${values.length}`
    );
  }

  if (status) {
    values.push(status);
    conditions.push(
      `status = $${values.length}`
    );
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(
      " AND "
    )}`;
  }

 
  sql +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesResult = await pool.query(
    sql,
    values
  );

  const issues = issuesResult.rows;

  
  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    ),
  ];

  let users = [];

  if (reporterIds.length > 0) {
    const userQuery = `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
    `;

    const usersResult =
      await pool.query(userQuery, [
        reporterIds,
      ]);

    users = usersResult.rows;
  }


  const finalData = issues.map(
    (issue) => {
      const reporter = users.find(
        (user) =>
          user.id === issue.reporter_id
      );

      return {
        id: issue.id,
        title: issue.title,
        description:
          issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at:
          issue.created_at,
        updated_at:
          issue.updated_at,
      };
    }
  );

  return finalData;
};

const singleIssueDB = async (
  issueId: number
) => {
  const issueResult =
    await pool.query(
      `SELECT * FROM issues WHERE id = $1`,
      [issueId]
    );

  const issue =
    issueResult.rows[0];

  if (!issue) {
    throw new Error(
      "Issue is not available"
    );
  }

  const reporterResult =
    await pool.query(
      `
      SELECT id, name, role
      FROM users
      WHERE id = $1
      `,
      [issue.reporter_id]
    );

  const reporter =
    reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description:
      issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at:
      issue.created_at,
    updated_at:
      issue.updated_at,
  };
};

export const issueInService ={
    issueIntoDB,
    getIssuesDB,
    singleIssueDB
}