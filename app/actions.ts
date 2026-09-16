'use server';
import {revalidatePath} from 'next/cache';
import {addReply,addReview} from '@/lib/db';
import {getGame} from '@/lib/games';
const text=(v:FormDataEntryValue|null,max:number)=>String(v??'').trim().slice(0,max);
export async function submitReview(fd:FormData){const gameSlug=text(fd.get('gameSlug'),80),author=text(fd.get('author'),50),body=text(fd.get('body'),1200),rating=Number(fd.get('rating'));if(!getGame(gameSlug)||author.length<2||body.length<3||!Number.isInteger(rating)||rating<1||rating>5)return;addReview(gameSlug,author,body,rating);revalidatePath(`/games/${gameSlug}`)}
export async function submitReply(fd:FormData){const gameSlug=text(fd.get('gameSlug'),80),author=text(fd.get('author'),50),body=text(fd.get('body'),1200),parentId=Number(fd.get('parentId'));if(!getGame(gameSlug)||author.length<2||body.length<2||!Number.isInteger(parentId))return;addReply(gameSlug,parentId,author,body);revalidatePath(`/games/${gameSlug}`)}
