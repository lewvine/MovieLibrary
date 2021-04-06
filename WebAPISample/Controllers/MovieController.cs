using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPISample.Data;
using WebAPISample.Models;

namespace WebAPISample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private ApplicationContext _context;
        // public URL where Backend has Read/Write permission, but everything else only has Read permission
        private readonly string userImages = "..\\Client\\images\\user\\";
        private readonly string userImagesDirectoryPath = "..\\Client\\images\\user";
        public MovieController(ApplicationContext context)
        {
            _context = context;
            System.IO.Directory.CreateDirectory(userImagesDirectoryPath);
        }
        // GET api/movie
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var movies = _context.Movies.Select(m => m);
                // Retrieve all movies from db logic
                return Ok(movies);
            }
            catch
            {
                return StatusCode(500);
            }
            
        }

        // GET api/movie/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                // Retrieve movie by id from db logic
                var movie = _context.Movies.Where(m => m.MovieId == id).SingleOrDefault();
                if (movie == null)
                {
                    return NotFound();
                }
                return Ok(movie);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // POST api/movie
        [HttpPost]
        public IActionResult Post([FromBody] Movie value)
        {
            try
            {
                // Create movie in db logic
                _context.Add(value);
                _context.SaveChanges();
                return Ok(value);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // PUT api/movie
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Movie movie)
        {
            try
            {
                // Update movie in db logic
                Movie m = _context.Movies.Where(m => m.MovieId == id).FirstOrDefault();
                if (m == null)
                {
                    return NotFound();
                }
                if (movie.Title != null)
                {
                    m.Title = movie.Title;
                }
                if (movie.Director != null)
                {
                    m.Director = movie.Director;
                }
                if (movie.Genre != null)
                {
                    m.Genre = movie.Genre;
                }
                _context.Update(m);
                _context.SaveChanges();
                return Ok(m);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // DELETE api/movie/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                // Delete movie from db logic
                Movie m = _context.Movies.Where(m => m.MovieId == id).FirstOrDefault();
                if (m == null)
                {
                    return NotFound();
                }
                _context.Remove(m);
                _context.SaveChanges();
                // Delete user Uploaded images
                if (System.IO.File.Exists(userImages + id + "Image.png"))
                {
                    System.IO.File.Delete(userImages + id + "Image.png");
                }
                return Ok(m);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // PUT api/movie
        [HttpPut("upload/{id}")]
        public IActionResult UpdateImage(int id, [FromForm] IFormFile file)
        {
            try
            {
                var movie = _context.Movies.Where(movie => movie.MovieId == id).FirstOrDefault();
                if (movie == null)
                {
                    return NotFound();
                }
                var filePath = $"{userImages}{id}Image.png";
                using (var stream = System.IO.File.Create(filePath))
                {
                    file.CopyTo(stream);
                    stream.Close();
                }
                movie.HasImage = true;
                _context.SaveChanges();
                return StatusCode(200);
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}