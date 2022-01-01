import { deepEqual } from 'assert'
import { Context } from 'koa'
import { flat } from './router'

const dummyHandler = (ctx: Context) => (ctx.status = 200)

suite('routes')

const postPet = {
  handler: dummyHandler,
  summary: 'uploads an image',
  responses: { 405: 'schema#InvalidResponse', 201: 'schema#Str' }
}

const deletePet = {
  handler: dummyHandler,
  summary: 'deletes a pet',
  responses: { 200: 'schema#Str' }
}

const updatePet = {
  handler: dummyHandler,
  summary: 'update an existing pet',
  responses: { 200: 'schema#Str' }
}

const uploadImagePet = {
  tags: ['pet'],
  handler: dummyHandler,
  summary: 'uploads an image',
  responses: { 200: 'schema#Str' }
}

test('flat routes', () => {
  const routes = {
    '/pet': {
      tags: ['pet'],

      post: postPet,
      delete: deletePet,
      '/update': { put: updatePet },

      '/{pet-id}/upload-image': { post: uploadImagePet },
    }
  }

  deepEqual(flat(routes),
    {
      '/pet': {
        post: postPet,
        delete: deletePet,
      },
      '/pet/update': { put: updatePet },
      '/pet/{pet-id}/upload-image': {
        post: {
          tags: ['pet'],
          handler: dummyHandler,
          summary: 'uploads an image',
          responses: { 200: 'schema#Str' }
        }
      }
    })
})
