import { getAuth } from '#clerk';
import { eq } from 'drizzle-orm';
import { PinataSDK } from 'pinata';


export default eventHandler(async (event) => {
  const { userId } = getAuth(event);
  const config = useRuntimeConfig();

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  const cid = getRouterParam(event, 'id');

  if (!cid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const pinata = new PinataSDK({
    pinataJwt: config.pinataJwt,
    pinataGateway: config.pinataGateway,
  });

  const db = useDatabase();
  if (!db) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
  const files = await pinata.files
  .list()
  .cid(cid)

  const deletedPinata = await pinata.files.delete([files.files[0].id]);

  if (!deletedPinata) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const deleteAudio = await db.delete(tables.generations).where(eq(tables.generations.audioId, cid));

  return {
   deletedPinata,
   deleteAudio
  }
})